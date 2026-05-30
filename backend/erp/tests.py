from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Farmer

class FarmerApiTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="tester", password="pass12345")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_farmer(self):
        response = self.client.post("/api/farmers/", {
            "code": "F001",
            "name": "Test Farmer",
            "phone": "9999999999",
            "village": "Test Village",
            "route": "Route A",
            "is_active": True,
        }, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Farmer.objects.count(), 1)
