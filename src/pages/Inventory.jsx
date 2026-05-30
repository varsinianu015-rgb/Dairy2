import { useEffect, useState } from "react";
import api from "../api/client";
import DataTable from "../ui/DataTable";
import FormCard, { Input, Select } from "../ui/FormCard";
import useCrud from "../hooks/useCrud";

const today = new Date().toISOString().slice(0, 10);
const initial = { product: "", batch_no: "", manufactured_date: today, expiry_date: "", quantity: 0, cost_per_unit: 0 };

export default function Inventory() {
  const { rows, form, setForm, create } = useCrud("/inventory-batches/", initial);
  const [products, setProducts] = useState([]);
  useEffect(() => { api.get("/products/").then((res) => setProducts(res.data.results || res.data)); }, []);
  function update(key, value) { setForm({ ...form, [key]: value }); }

  return (
    <>
      <div className="page-title"><h1>Inventory</h1><p>Batch-wise inventory and stock valuation.</p></div>
      <FormCard title="Add Batch" onSubmit={(e) => { e.preventDefault(); create({ ...form, product: Number(form.product), expiry_date: form.expiry_date || null }); }}>
        <Select label="Product" value={form.product} onChange={(e) => update("product", e.target.value)} required>
          <option value="">Select product</option>{products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
        <Input label="Batch No" value={form.batch_no} onChange={(e) => update("batch_no", e.target.value)} required />
        <Input label="Manufactured Date" type="date" value={form.manufactured_date} onChange={(e) => update("manufactured_date", e.target.value)} />
        <Input label="Expiry Date" type="date" value={form.expiry_date} onChange={(e) => update("expiry_date", e.target.value)} />
        <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} />
        <Input label="Cost/Unit" type="number" value={form.cost_per_unit} onChange={(e) => update("cost_per_unit", e.target.value)} />
      </FormCard>
      <DataTable columns={[
        { key: "batch_no", label: "Batch" },
        { key: "product_name", label: "Product" },
        { key: "manufactured_date", label: "Mfg Date" },
        { key: "expiry_date", label: "Expiry" },
        { key: "quantity", label: "Qty" },
        { key: "stock_value", label: "Stock Value" },
      ]} rows={rows} />
    </>
  );
}
