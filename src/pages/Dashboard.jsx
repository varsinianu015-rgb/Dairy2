import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/client";

function Kpi({ label, value }) {
  return <div className="kpi"><span>{label}</span><strong>{value}</strong></div>;
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [chart, setChart] = useState([]);

  useEffect(() => {
    api.get("/dashboard/summary/").then((res) => setSummary(res.data));
    api.get("/dashboard/collection-chart/").then((res) => setChart(res.data));
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <>
      <div className="page-title">
        <h1>Dairy ERP Dashboard</h1>
        <p>Today: {summary.today}</p>
      </div>

      <div className="kpi-grid">
        <Kpi label="Active Farmers" value={summary.active_farmers} />
        <Kpi label="Customers" value={summary.customers} />
        <Kpi label="Milk Collected Today" value={`${summary.today_collection_liters} L`} />
        <Kpi label="Procurement Cost" value={`₹${summary.today_procurement_amount}`} />
        <Kpi label="Sales Today" value={`₹${summary.today_sales}`} />
        <Kpi label="Payments Today" value={`₹${summary.today_payments}`} />
        <Kpi label="Expenses Today" value={`₹${summary.today_expenses}`} />
        <Kpi label="Low Stock Batches" value={summary.low_stock_batches} />
      </div>

      <div className="card">
        <h2>Last 14 Days Milk Collection</h2>
        <div style={{ height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="liters" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
