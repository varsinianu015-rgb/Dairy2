import { useState } from "react";
import api from "../api/client";
import { Input } from "../ui/FormCard";

export default function Reports() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [report, setReport] = useState(null);

  async function load() {
    const params = new URLSearchParams();
    if (start) params.append("start", start);
    if (end) params.append("end", end);
    const res = await api.get(`/reports/profit-loss/?${params.toString()}`);
    setReport(res.data);
  }

  return (
    <>
      <div className="page-title"><h1>Reports</h1><p>Profit and loss report.</p></div>
      <div className="card form-card">
        <h2>Profit & Loss</h2>
        <div className="form-grid">
          <Input label="Start Date" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          <Input label="End Date" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <button className="primary" onClick={load}>Generate</button>
      </div>

      {report && (
        <div className="kpi-grid">
          <div className="kpi"><span>Revenue</span><strong>₹{report.revenue}</strong></div>
          <div className="kpi"><span>Procurement Cost</span><strong>₹{report.procurement_cost}</strong></div>
          <div className="kpi"><span>Operating Expenses</span><strong>₹{report.operating_expenses}</strong></div>
          <div className="kpi"><span>Gross Profit</span><strong>₹{report.gross_profit}</strong></div>
          <div className="kpi"><span>Net Profit</span><strong>₹{report.net_profit}</strong></div>
        </div>
      )}
    </>
  );
}
