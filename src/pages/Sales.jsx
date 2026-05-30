import { useEffect, useState } from "react";
import api from "../api/client";
import DataTable from "../ui/DataTable";
import FormCard, { Input, Select } from "../ui/FormCard";
import useCrud from "../hooks/useCrud";

const today = new Date().toISOString().slice(0, 10);
const initial = { invoice_no: "", customer: "", sale_date: today, product: "", batch: "", quantity: 0, unit_price: 0, discount: 0, payment_status: "pending" };

export default function Sales() {
  const { rows, form, setForm, create } = useCrud("/sales/", initial);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    api.get("/customers/").then((res) => setCustomers(res.data.results || res.data));
    api.get("/products/").then((res) => setProducts(res.data.results || res.data));
    api.get("/inventory-batches/").then((res) => setBatches(res.data.results || res.data));
  }, []);

  function update(key, value) { setForm({ ...form, [key]: value }); }

  return (
    <>
      <div className="page-title"><h1>Sales</h1><p>Invoice creation and billing.</p></div>
      <FormCard title="Create Sale" onSubmit={(e) => { e.preventDefault(); create({ ...form, customer: Number(form.customer), product: Number(form.product), batch: form.batch ? Number(form.batch) : null }); }}>
        <Input label="Invoice No" value={form.invoice_no} onChange={(e) => update("invoice_no", e.target.value)} required />
        <Select label="Customer" value={form.customer} onChange={(e) => update("customer", e.target.value)} required>
          <option value="">Select customer</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Input label="Sale Date" type="date" value={form.sale_date} onChange={(e) => update("sale_date", e.target.value)} />
        <Select label="Product" value={form.product} onChange={(e) => update("product", e.target.value)} required>
          <option value="">Select product</option>{products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
        <Select label="Batch" value={form.batch} onChange={(e) => update("batch", e.target.value)}>
          <option value="">No batch</option>{batches.map((b) => <option key={b.id} value={b.id}>{b.batch_no} - {b.product_name} - Qty {b.quantity}</option>)}
        </Select>
        <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} />
        <Input label="Unit Price" type="number" value={form.unit_price} onChange={(e) => update("unit_price", e.target.value)} />
        <Input label="Discount" type="number" value={form.discount} onChange={(e) => update("discount", e.target.value)} />
      </FormCard>
      <DataTable columns={[
        { key: "invoice_no", label: "Invoice" },
        { key: "sale_date", label: "Date" },
        { key: "customer_name", label: "Customer" },
        { key: "product_name", label: "Product" },
        { key: "quantity", label: "Qty" },
        { key: "total_amount", label: "Total" },
        { key: "payment_status", label: "Status" },
      ]} rows={rows} />
    </>
  );
}
