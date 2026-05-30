from django.contrib import admin
from .models import Farmer, Customer, Product, MilkCollection, QualityTest, InventoryBatch, Sale, Payment, Expense

@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "phone", "village", "route", "is_active")
    search_fields = ("code", "name", "phone")

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "customer_type", "phone", "credit_limit")
    search_fields = ("code", "name", "phone")

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("sku", "name", "product_type", "unit", "selling_price", "reorder_level")
    search_fields = ("sku", "name")

@admin.register(MilkCollection)
class MilkCollectionAdmin(admin.ModelAdmin):
    list_display = ("farmer", "collection_date", "shift", "quantity_liters", "fat_percent", "snf_percent", "rate_per_liter", "amount")
    list_filter = ("collection_date", "shift", "farmer__route")

@admin.register(QualityTest)
class QualityTestAdmin(admin.ModelAdmin):
    list_display = ("collection", "temperature_c", "acidity", "adulteration_detected")

@admin.register(InventoryBatch)
class InventoryBatchAdmin(admin.ModelAdmin):
    list_display = ("batch_no", "product", "manufactured_date", "expiry_date", "quantity", "cost_per_unit", "stock_value")

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ("invoice_no", "customer", "sale_date", "product", "quantity", "unit_price", "discount", "total_amount", "payment_status")

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("sale", "payment_date", "amount", "mode", "reference_no")

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("expense_date", "category", "description", "amount")
