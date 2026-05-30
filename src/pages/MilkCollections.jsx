import { useEffect, useState } from "react";
import api from "../api/client";
import DataTable from "../ui/DataTable";
import FormCard, { Input, Select } from "../ui/FormCard";
import useCrud from "../hooks/useCrud";

const today = new Date().toISOString().slice(0, 10);
const initial = { farmer: "", collection_date: today, shift: "morning", quantity_liters: 0, fat_percent: 4.0, snf_percent: 8.5, rate_per_liter: 42, notes: "" };

export default function MilkCollections() {
  const { rows, form, setForm, create } = useCrud("/milk-collections/", initial);
  const [farmers, setFarmers] = useState([]);
  useEffect(() => { api.get("/farmers/").then((res) => setFarmers(res.data.results || res.data)); }, []);
  function update(key, value) { setForm({ ...form, [key]: value }); }

  return (
    <>
      <div className="page-title"><h1>Milk Collections</h1><p>Daily procurement by farmer and shift.</p></div>
      <FormCard title="Add Collection" onSubmit={(e) => { e.preventDefault(); create({ ...form, farmer: Number(form.farmer) }); }}>
        <Select label="Farmer" value={form.farmer} onChange={(e) => update("farmer", e.target.value)} required>
          <option value="">Select farmer</option>{farmers.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </Select>
        <Input label="Date" type="date" value={form.collection_date} onChange={(e) => update("collection_date", e.target.value)} />
        <Select label="Shift" value={form.shift} onChange={(e) => update("shift", e.target.value)}><option value="morning">Morning</option><option value="evening">Evening</option></Select>
        <Input label="Liters" type="number" value={form.quantity_liters} onChange={(e) => update("quantity_liters", e.target.value)} />
        <Input label="FAT %" type="number" step="0.01" value={form.fat_percent} onChange={(e) => update("fat_percent", e.target.value)} />
        <Input label="SNF %" type="number" step="0.01" value={form.snf_percent} onChange={(e) => update("snf_percent", e.target.value)} />
        <Input label="Rate/Liter" type="number" value={form.rate_per_liter} onChange={(e) => update("rate_per_liter", e.target.value)} />
      </FormCard>
      <DataTable columns={[
        { key: "collection_date", label: "Date" },
        { key: "shift", label: "Shift" },
        { key: "farmer_name", label: "Farmer" },
        { key: "quantity_liters", label: "Liters" },
        { key: "fat_percent", label: "FAT" },
        { key: "snf_percent", label: "SNF" },
        { key: "amount", label: "Amount" },
      ]} rows={rows} />
    </>
  );
}
