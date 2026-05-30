# Dairy ERP Full-Stack App

Production-ready starter for a dairy ERP using:

- Backend: Python, Django, Django REST Framework, SimpleJWT
- Frontend: React, Vite, React Router, Axios
- Database: SQLite by default, PostgreSQL via Docker
- Modules: Farmers, milk collections, quality tests, products, inventory, customers, sales, payments, expenses, dashboard KPIs

## Quick Start Without Docker

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Demo login:

```text
username: admin
password: admin12345
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://127.0.0.1:5173
```

## Docker Start

```bash
docker compose up --build
```

Then run migrations and seed:

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py seed_demo
```

## API

Auth:

```text
POST /api/auth/token/
POST /api/auth/token/refresh/
```

Main endpoints:

```text
/api/farmers/
/api/milk-collections/
/api/quality-tests/
/api/products/
/api/inventory-batches/
/api/customers/
/api/sales/
/api/payments/
/api/expenses/
/api/dashboard/summary/
/api/dashboard/collection-chart/
/api/reports/profit-loss/
```

## Suggested Enhancements

1. Add IoT milk analyzer integration.
2. Add QR-code based batch traceability.
3. Add route-wise vehicle fuel costing.
4. Add AI-based milk yield forecasting.
5. Add anomaly detection for adulteration, SNF/FAT variance, and farmer fraud.
6. Add WhatsApp/SMS billing and payment reminders.
7. Add mobile app for field collection agents.
