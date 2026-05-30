from decimal import Decimal
from django.db.models import Sum, F, DecimalField, ExpressionWrapper
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Farmer, Customer, Product, MilkCollection, QualityTest, InventoryBatch, Sale, Payment, Expense
from .serializers import (
    FarmerSerializer, CustomerSerializer, ProductSerializer, MilkCollectionSerializer,
    QualityTestSerializer, InventoryBatchSerializer, SaleSerializer, PaymentSerializer, ExpenseSerializer
)

class BaseModelViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

class FarmerViewSet(BaseModelViewSet):
    queryset = Farmer.objects.all().order_by("name")
    serializer_class = FarmerSerializer
    search_fields = ["code", "name", "phone", "village", "route"]
    filterset_fields = ["is_active", "route", "village"]

class CustomerViewSet(BaseModelViewSet):
    queryset = Customer.objects.all().order_by("name")
    serializer_class = CustomerSerializer
    search_fields = ["code", "name", "phone", "address"]
    filterset_fields = ["customer_type"]

class ProductViewSet(BaseModelViewSet):
    queryset = Product.objects.all().order_by("name")
    serializer_class = ProductSerializer
    search_fields = ["sku", "name"]
    filterset_fields = ["product_type", "unit"]

class MilkCollectionViewSet(BaseModelViewSet):
    queryset = MilkCollection.objects.select_related("farmer").all()
    serializer_class = MilkCollectionSerializer
    search_fields = ["farmer__name", "farmer__code", "notes"]
    filterset_fields = ["collection_date", "shift", "farmer", "farmer__route"]

class QualityTestViewSet(BaseModelViewSet):
    queryset = QualityTest.objects.select_related("collection", "collection__farmer").all()
    serializer_class = QualityTestSerializer
    search_fields = ["collection__farmer__name", "remarks"]
    filterset_fields = ["adulteration_detected"]

class InventoryBatchViewSet(BaseModelViewSet):
    queryset = InventoryBatch.objects.select_related("product").all().order_by("-manufactured_date")
    serializer_class = InventoryBatchSerializer
    search_fields = ["batch_no", "product__name"]
    filterset_fields = ["product"]

class SaleViewSet(BaseModelViewSet):
    queryset = Sale.objects.select_related("customer", "product", "batch").all()
    serializer_class = SaleSerializer
    search_fields = ["invoice_no", "customer__name", "product__name"]
    filterset_fields = ["sale_date", "payment_status", "customer", "product"]

    def perform_create(self, serializer):
        sale = serializer.save()
        if sale.batch:
            sale.batch.quantity = sale.batch.quantity - sale.quantity
            sale.batch.save(update_fields=["quantity", "updated_at"])

class PaymentViewSet(BaseModelViewSet):
    queryset = Payment.objects.select_related("sale").all().order_by("-payment_date")
    serializer_class = PaymentSerializer
    search_fields = ["sale__invoice_no", "reference_no"]
    filterset_fields = ["payment_date", "mode", "sale"]

class ExpenseViewSet(BaseModelViewSet):
    queryset = Expense.objects.all().order_by("-expense_date")
    serializer_class = ExpenseSerializer
    search_fields = ["description", "category"]
    filterset_fields = ["expense_date", "category"]

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def dashboard_summary(request):
    today = timezone.localdate()

    collection_qty = MilkCollection.objects.filter(collection_date=today).aggregate(
        total=Coalesce(Sum("quantity_liters"), Decimal("0.00"))
    )["total"]

    collection_amount = MilkCollection.objects.filter(collection_date=today).aggregate(
        total=Coalesce(Sum(ExpressionWrapper(F("quantity_liters") * F("rate_per_liter"), output_field=DecimalField())), Decimal("0.00"))
    )["total"]

    sale_amount = Sale.objects.filter(sale_date=today).aggregate(
        total=Coalesce(Sum(ExpressionWrapper(F("quantity") * F("unit_price") - F("discount"), output_field=DecimalField())), Decimal("0.00"))
    )["total"]

    paid_amount = Payment.objects.filter(payment_date=today).aggregate(
        total=Coalesce(Sum("amount"), Decimal("0.00"))
    )["total"]

    expense_amount = Expense.objects.filter(expense_date=today).aggregate(
        total=Coalesce(Sum("amount"), Decimal("0.00"))
    )["total"]

    low_stock_count = InventoryBatch.objects.filter(quantity__lte=F("product__reorder_level")).count()

    return Response({
        "today": str(today),
        "active_farmers": Farmer.objects.filter(is_active=True).count(),
        "customers": Customer.objects.count(),
        "today_collection_liters": collection_qty,
        "today_procurement_amount": collection_amount,
        "today_sales": sale_amount,
        "today_payments": paid_amount,
        "today_expenses": expense_amount,
        "low_stock_batches": low_stock_count,
    })

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def collection_chart(request):
    qs = (
        MilkCollection.objects
        .values("collection_date")
        .annotate(liters=Sum("quantity_liters"))
        .order_by("-collection_date")[:14]
    )
    data = list(reversed([{"date": str(row["collection_date"]), "liters": row["liters"]} for row in qs]))
    return Response(data)

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def profit_loss_report(request):
    start = request.GET.get("start")
    end = request.GET.get("end")
    sales = Sale.objects.all()
    collections = MilkCollection.objects.all()
    expenses = Expense.objects.all()

    if start:
        sales = sales.filter(sale_date__gte=start)
        collections = collections.filter(collection_date__gte=start)
        expenses = expenses.filter(expense_date__gte=start)
    if end:
        sales = sales.filter(sale_date__lte=end)
        collections = collections.filter(collection_date__lte=end)
        expenses = expenses.filter(expense_date__lte=end)

    revenue = sales.aggregate(
        total=Coalesce(Sum(ExpressionWrapper(F("quantity") * F("unit_price") - F("discount"), output_field=DecimalField())), Decimal("0.00"))
    )["total"]
    procurement_cost = collections.aggregate(
        total=Coalesce(Sum(ExpressionWrapper(F("quantity_liters") * F("rate_per_liter"), output_field=DecimalField())), Decimal("0.00"))
    )["total"]
    operating_expenses = expenses.aggregate(total=Coalesce(Sum("amount"), Decimal("0.00")))["total"]

    return Response({
        "start": start,
        "end": end,
        "revenue": revenue,
        "procurement_cost": procurement_cost,
        "operating_expenses": operating_expenses,
        "gross_profit": revenue - procurement_cost,
        "net_profit": revenue - procurement_cost - operating_expenses,
    })
