import DataTable from "../ui/DataTable";
import FormCard, { Input } from "../ui/FormCard";
import useCrud from "../hooks/useCrud";

const initial = { code: "", name: "", phone: "", village: "", route: "", bank_account: "", is_active: true };

export default function Farmers() {
  const { rows, form, setForm, create, error } = useCrud("/farmers/", initial);

  function update(key, value) { setForm({ ...form, [key]: value }); }

  return (
    <>
      <div className="page-title"><h1>Farmers</h1><p>Supplier master and route management.</p></div>
      {error && <div className="error">{error}</div>}
      <FormCard title="Add Farmer" onSubmit={(e) => { e.preventDefault(); create(); }}>
        <Input label="Code" value={form.code} onChange={(e) => update("code", e.target.value)} required />
        <Input label="Name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        <Input label="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        <Input label="Village" value={form.village} onChange={(e) => update("village", e.target.value)} />
        <Input label="Route" value={form.route} onChange={(e) => update("route", e.target.value)} />
        <Input label="Bank Account" value={form.bank_account} onChange={(e) => update("bank_account", e.target.value)} />
      </FormCard>
      <DataTable columns={[
        { key: "code", label: "Code" },
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "village", label: "Village" },
        { key: "route", label: "Route" },
      ]} rows={rows} />
    </>
  );
}
