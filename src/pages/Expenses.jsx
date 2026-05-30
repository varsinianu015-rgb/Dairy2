import DataTable from "../ui/DataTable";
import FormCard, { Input, Select } from "../ui/FormCard";
import useCrud from "../hooks/useCrud";

const today = new Date().toISOString().slice(0, 10);
const initial = { expense_date: today, category: "transport", description: "", amount: 0 };

export default function Expenses() {
  const { rows, form, setForm, create } = useCrud("/expenses/", initial);
  function update(key, value) { setForm({ ...form, [key]: value }); }

  return (
    <>
      <div className="page-title"><h1>Expenses</h1><p>Operating cost tracking.</p></div>
      <FormCard title="Add Expense" onSubmit={(e) => { e.preventDefault(); create(); }}>
        <Input label="Date" type="date" value={form.expense_date} onChange={(e) => update("expense_date", e.target.value)} />
        <Select label="Category" value={form.category} onChange={(e) => update("category", e.target.value)}>
          <option value="feed">Feed</option><option value="transport">Transport</option><option value="salary">Salary</option><option value="maintenance">Maintenance</option><option value="utilities">Utilities</option><option value="other">Other</option>
        </Select>
        <Input label="Description" value={form.description} onChange={(e) => update("description", e.target.value)} required />
        <Input label="Amount" type="number" value={form.amount} onChange={(e) => update("amount", e.target.value)} />
      </FormCard>
      <DataTable columns={[
        { key: "expense_date", label: "Date" },
        { key: "category", label: "Category" },
        { key: "description", label: "Description" },
        { key: "amount", label: "Amount" },
      ]} rows={rows} />
    </>
  );
}
