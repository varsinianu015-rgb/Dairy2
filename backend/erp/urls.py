from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FarmerViewSet, CustomerViewSet, ProductViewSet, MilkCollectionViewSet,
    QualityTestViewSet, InventoryBatchViewSet, SaleViewSet, PaymentViewSet,
    ExpenseViewSet, dashboard_summary, collection_chart, profit_loss_report
)

router = DefaultRouter()
router.register("farmers", FarmerViewSet)
router.register("customers", CustomerViewSet)
router.register("products", ProductViewSet)
router.register("milk-collections", MilkCollectionViewSet)
router.register("quality-tests", QualityTestViewSet)
router.register("inventory-batches", InventoryBatchViewSet)
router.register("sales", SaleViewSet)
router.register("payments", PaymentViewSet)
router.register("expenses", ExpenseViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("dashboard/summary/", dashboard_summary),
    path("dashboard/collection-chart/", collection_chart),
    path("reports/profit-loss/", profit_loss_report),
]
