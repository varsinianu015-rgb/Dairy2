import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, Boxes, CreditCard, Factory, Home, LogOut, Milk, Package, Receipt, Users } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/farmers", label: "Farmers", icon: Users },
  { to: "/collections", label: "Milk Collections", icon: Milk },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/products", label: "Products", icon: Package },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/sales", label: "Sales", icon: Receipt },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/expenses", label: "Expenses", icon: Factory },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export default function AppLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Dairy ERP</div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => isActive ? "nav active" : "nav"}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <button className="logout" onClick={logout}><LogOut size={18} /> Logout</button>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
