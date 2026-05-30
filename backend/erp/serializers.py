from rest_framework import serializers
from .models import Farmer, Customer, Product, MilkCollection, QualityTest, InventoryBatch, Sale, Payment, Expense

class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = "__all__"

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

class MilkCollectionSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source="farmer.name", read_only=True)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = MilkCollection
        fields = "__all__"

class QualityTestSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source="collection.farmer.name", read_only=True)
    collection_date = serializers.DateField(source="collection.collection_date", read_only=True)

    class Meta:
        model = QualityTest
        fields = "__all__"

class InventoryBatchSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    stock_value = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)

    class Meta:
        model = InventoryBatch
        fields = "__all__"

class SaleSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    total_amount = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)

    class Meta:
        model = Sale
        fields = "__all__"

    def validate(self, attrs):
        batch = attrs.get("batch")
        quantity = attrs.get("quantity")
        if batch and quantity and quantity > batch.quantity:
            raise serializers.ValidationError("Sale quantity cannot exceed selected batch stock.")
        return attrs

class PaymentSerializer(serializers.ModelSerializer):
    invoice_no = serializers.CharField(source="sale.invoice_no", read_only=True)

    class Meta:
        model = Payment
        fields = "__all__"

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"
