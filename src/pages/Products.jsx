import DataTable from "../ui/DataTable";
import FormCard, { Input, Select } from "../ui/FormCard";
import useCrud from "../hooks/useCrud";

const initial = { sku: "", name: "", product_type: "milk", unit: "L", selling_price: 0, reorder_level: 0 };

export default function Products() {
  const { rows, form, setForm, create } = useCrud("/products/", initial);
  function update(key, value) { setForm({ ...form, [key]: value }); }

  return (
    <>
      <div className="page-title"><h1>Products</h1><p>Product catalog and price master.</p></div>
      <FormCard title="Add Product" onSubmit={(e) => { e.preventDefault(); create(); }}>
        <Input label="SKU" value={form.sku} onChange={(e) => update("sku", e.target.value)} required />
        <Input label="Name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        <Select label="Type" value={form.product_type} onChange={(e) => update("product_type", e.target.value)}>
          <option value="milk">Milk</option><option value="curd">Curd</option><option value="ghee">Ghee</option><option value="paneer">Paneer</option><option value="butter">Butter</option><option value="other">Other</option>
        </Select>
        <Input label="Unit" value={form.unit} onChange={(e) => update("unit", e.target.value)} />
        <Input label="Selling Price" type="number" value={form.selling_price} onChange={(e) => update("selling_price", e.target.value)} />
        <Input label="Reorder Level" type="number" value={form.reorder_level} onChange={(e) => update("reorder_level", e.target.value)} />
      </FormCard>
      <DataTable columns={[
        { key: "sku", label: "SKU" },
        { key: "name", label: "Name" },
        { key: "product_type", label: "Type" },
        { key: "unit", label: "Unit" },
        { key: "selling_price", label: "Price" },
      ]} rows={rows} />
    </>
  );
}
