from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Farmer(TimeStampedModel):
    code = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30, blank=True)
    village = models.CharField(max_length=100, blank=True)
    route = models.CharField(max_length=100, blank=True)
    bank_account = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Customer(TimeStampedModel):
    CUSTOMER_TYPES = [
        ("retail", "Retail"),
        ("wholesale", "Wholesale"),
        ("institution", "Institution"),
    ]
    code = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30, blank=True)
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPES, default="retail")
    address = models.TextField(blank=True)
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return self.name

class Product(TimeStampedModel):
    PRODUCT_TYPES = [
        ("milk", "Milk"),
        ("curd", "Curd"),
        ("ghee", "Ghee"),
        ("paneer", "Paneer"),
        ("butter", "Butter"),
        ("other", "Other"),
    ]
    sku = models.CharField(max_length=40, unique=True)
    name = models.CharField(max_length=150)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES)
    unit = models.CharField(max_length=20, default="L")
    selling_price = models.DecimalField(max_digits=12, decimal_places=2)
    reorder_level = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return self.name

class MilkCollection(TimeStampedModel):
    SHIFT_CHOICES = [("morning", "Morning"), ("evening", "Evening")]
    farmer = models.ForeignKey(Farmer, on_delete=models.PROTECT, related_name="collections")
    collection_date = models.DateField()
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES)
    quantity_liters = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))])
    fat_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    snf_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    rate_per_liter = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ("farmer", "collection_date", "shift")
        ordering = ["-collection_date", "shift"]

    @property
    def amount(self):
        return round(self.quantity_liters * self.rate_per_liter, 2)

    def __str__(self):
        return f"{self.farmer.name} {self.collection_date} {self.shift}"

class QualityTest(TimeStampedModel):
    collection = models.OneToOneField(MilkCollection, on_delete=models.CASCADE, related_name="quality_test")
    temperature_c = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    acidity = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    adulteration_detected = models.BooleanField(default=False)
    remarks = models.TextField(blank=True)

class InventoryBatch(TimeStampedModel):
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="batches")
    batch_no = models.CharField(max_length=80, unique=True)
    manufactured_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    cost_per_unit = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    @property
    def stock_value(self):
        return round(self.quantity * self.cost_per_unit, 2)

    def __str__(self):
        return f"{self.batch_no} - {self.product.name}"

class Sale(TimeStampedModel):
    PAYMENT_STATUS = [
        ("pending", "Pending"),
        ("partial", "Partial"),
        ("paid", "Paid"),
    ]
    invoice_no = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="sales")
    sale_date = models.DateField()
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    batch = models.ForeignKey(InventoryBatch, on_delete=models.PROTECT, null=True, blank=True)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="pending")

    class Meta:
        ordering = ["-sale_date", "-created_at"]

    @property
    def total_amount(self):
        return round((self.quantity * self.unit_price) - self.discount, 2)

    def __str__(self):
        return self.invoice_no

class Payment(TimeStampedModel):
    PAYMENT_MODES = [
        ("cash", "Cash"),
        ("upi", "UPI"),
        ("bank", "Bank"),
        ("card", "Card"),
    ]
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name="payments")
    payment_date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    mode = models.CharField(max_length=20, choices=PAYMENT_MODES, default="cash")
    reference_no = models.CharField(max_length=100, blank=True)

class Expense(TimeStampedModel):
    CATEGORY_CHOICES = [
        ("feed", "Feed"),
        ("transport", "Transport"),
        ("salary", "Salary"),
        ("maintenance", "Maintenance"),
        ("utilities", "Utilities"),
        ("other", "Other"),
    ]
    expense_date = models.DateField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
