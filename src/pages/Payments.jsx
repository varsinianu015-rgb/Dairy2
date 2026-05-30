import { useEffect, useState } from "react";
import api from "../api/client";
import DataTable from "../ui/DataTable";
import FormCard, { Input, Select } from "../ui/FormCard";
import useCrud from "../hooks/useCrud";

const today = new Date().toISOString().slice(0, 10);
const initial = { sale: "", payment_date: today, amount: 0, mode: "cash", reference_no: "" };

export default function Payments() {
  const { rows, form, setForm, create } = useCrud("/payments/", initial);
  const [sales, setSales] = useState([]);
  useEffect(() => { api.get("/sales/").then((res) => setSales(res.data.results || res.data)); }, []);
  function update(key, value) { setForm({ ...form, [key]: value }); }

  return (
    <>
      <div className="page-title"><h1>Payments</h1><p>Receipts against invoices.</p></div>
      <FormCard title="Record Payment" onSubmit={(e) => { e.preventDefault(); create({ ...form, sale: Number(form.sale) }); }}>
        <Select label="Invoice" value={form.sale} onChange={(e) => update("sale", e.target.value)} required>
          <option value="">Select invoice</option>{sales.map((s) => <option key={s.id} value={s.id}>{s.invoice_no} - {s.customer_name}</option>)}
        </Select>
        <Input label="Date" type="date" value={form.payment_date} onChange={(e) => update("payment_date", e.target.value)} />
        <Input label="Amount" type="number" value={form.amount} onChange={(e) => update("amount", e.target.value)} />
        <Select label="Mode" value={form.mode} onChange={(e) => update("mode", e.target.value)}>
          <option value="cash">Cash</option><option value="upi">UPI</option><option value="bank">Bank</option><option value="card">Card</option>
        </Select>
        <Input label="Reference No" value={form.reference_no} onChange={(e) => update("reference_no", e.target.value)} />
      </FormCard>
      <DataTable columns={[
        { key: "invoice_no", label: "Invoice" },
        { key: "payment_date", label: "Date" },
        { key: "amount", label: "Amount" },
        { key: "mode", label: "Mode" },
        { key: "reference_no", label: "Reference" },
      ]} rows={rows} />
    </>
  );
}
