import DataTable from "../ui/DataTable";
import FormCard, { Input, Select } from "../ui/FormCard";
import useCrud from "../hooks/useCrud";

const initial = { code: "", name: "", phone: "", customer_type: "retail", address: "", credit_limit: 0 };

export default function Customers() {
  const { rows, form, setForm, create } = useCrud("/customers/", initial);
  function update(key, value) { setForm({ ...form, [key]: value }); }

  return (
    <>
      <div className="page-title"><h1>Customers</h1><p>Retail, wholesale, and institutional customers.</p></div>
      <FormCard title="Add Customer" onSubmit={(e) => { e.preventDefault(); create(); }}>
        <Input label="Code" value={form.code} onChange={(e) => update("code", e.target.value)} required />
        <Input label="Name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        <Input label="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        <Select label="Type" value={form.customer_type} onChange={(e) => update("customer_type", e.target.value)}>
          <option value="retail">Retail</option><option value="wholesale">Wholesale</option><option value="institution">Institution</option>
        </Select>
        <Input label="Address" value={form.address} onChange={(e) => update("address", e.target.value)} />
        <Input label="Credit Limit" type="number" value={form.credit_limit} onChange={(e) => update("credit_limit", e.target.value)} />
      </FormCard>
      <DataTable columns={[
        { key: "code", label: "Code" },
        { key: "name", label: "Name" },
        { key: "customer_type", label: "Type" },
        { key: "phone", label: "Phone" },
        { key: "credit_limit", label: "Credit Limit" },
      ]} rows={rows} />
    </>
  );
}
