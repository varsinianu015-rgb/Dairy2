import { useEffect, useState } from "react";
import api from "../api/client";

export default function useCrud(endpoint, initialForm) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get(endpoint);
      setRows(res.data.results || res.data);
      setError("");
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function create(payload = form) {
    await api.post(endpoint, payload);
    setForm(initialForm);
    await load();
  }

  useEffect(() => { load(); }, [endpoint]);

  return { rows, form, setForm, loading, error, create, reload: load };
}
