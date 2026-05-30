from decimal import Decimal
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from erp.models import Farmer, Customer, Product, MilkCollection, QualityTest, InventoryBatch, Sale, Payment, Expense

class Command(BaseCommand):
    help = "Seed demo data for Dairy ERP"

    def handle(self, *args, **kwargs):
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@example.com", "admin12345")

        f1, _ = Farmer.objects.get_or_create(code="F001", defaults={"name": "Ramesh Dairy Farm", "phone": "9876543210", "village": "Rampur", "route": "North"})
        f2, _ = Farmer.objects.get_or_create(code="F002", defaults={"name": "Sita Milk Supplier", "phone": "9876500001", "village": "Nandgaon", "route": "East"})

        c1, _ = Customer.objects.get_or_create(code="C001", defaults={"name": "FreshMart Retail", "phone": "9000011111", "customer_type": "retail", "address": "Market Road"})
        c2, _ = Customer.objects.get_or_create(code="C002", defaults={"name": "City Hotel", "phone": "9000022222", "customer_type": "institution", "address": "Station Road"})

        milk, _ = Product.objects.get_or_create(sku="MILK-001", defaults={"name": "Full Cream Milk", "product_type": "milk", "unit": "L", "selling_price": Decimal("62.00"), "reorder_level": Decimal("30.00")})
        curd, _ = Product.objects.get_or_create(sku="CURD-001", defaults={"name": "Curd 500g", "product_type": "curd", "unit": "pcs", "selling_price": Decimal("35.00"), "reorder_level": Decimal("50.00")})

        today = timezone.localdate()
        for i in range(10):
            day = today - timedelta(days=i)
            for farmer, qty in [(f1, Decimal("115.50") + i), (f2, Decimal("88.00") + i)]:
                mc, _ = MilkCollection.objects.get_or_create(
                    farmer=farmer,
                    collection_date=day,
                    shift="morning",
                    defaults={
                        "quantity_liters": qty,
                        "fat_percent": Decimal("4.20"),
                        "snf_percent": Decimal("8.50"),
                        "rate_per_liter": Decimal("42.00"),
                    },
                )
                QualityTest.objects.get_or_create(collection=mc, defaults={"temperature_c": Decimal("6.50"), "acidity": Decimal("0.14")})

        batch, _ = InventoryBatch.objects.get_or_create(
            batch_no="BATCH-MILK-001",
            defaults={
                "product": milk,
                "manufactured_date": today,
                "expiry_date": today + timedelta(days=2),
                "quantity": Decimal("500.00"),
                "cost_per_unit": Decimal("44.00"),
            },
        )

        sale, _ = Sale.objects.get_or_create(
            invoice_no="INV-0001",
            defaults={
                "customer": c1,
                "sale_date": today,
                "product": milk,
                "batch": batch,
                "quantity": Decimal("50.00"),
                "unit_price": Decimal("62.00"),
                "discount": Decimal("0.00"),
                "payment_status": "partial",
            },
        )
        Payment.objects.get_or_create(sale=sale, payment_date=today, amount=Decimal("1500.00"), mode="upi", reference_no="DEMO-UPI-001")
        Expense.objects.get_or_create(expense_date=today, category="transport", description="Morning route fuel", amount=Decimal("850.00"))

        self.stdout.write(self.style.SUCCESS("Demo data ready. Login: admin / admin12345"))
