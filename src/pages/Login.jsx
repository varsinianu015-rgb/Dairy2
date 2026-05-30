import { useState } from "react";
import api from "../api/client";

export default function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin12345");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/token/", { username, password });
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);
      window.location.href = "/";
    } catch {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1>Dairy ERP</h1>
        <p>Manage milk procurement, inventory, billing, and payments.</p>
        {error && <div className="error">{error}</div>}
        <label><span>Username</span><input value={username} onChange={(e) => setUsername(e.target.value)} /></label>
        <label><span>Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="primary">Login</button>
      </form>
    </div>
  );
}
