import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", code: "01" },
  { to: "/exercises", label: "Exercises", code: "02" },
  { to: "/workouts", label: "Workouts", code: "03" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-mark">L</span>
          <div>
            <div className="sidebar-title">Ledger</div>
            <div className="sidebar-sub eyebrow">Training Log</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
            >
              <span className="sidebar-link-code mono">{item.code}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{user?.name?.[0]?.toUpperCase() || "?"}</div>
            <div>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-email mono">{user?.email}</div>
            </div>
          </div>
          <button className="btn btn-outline btn-sm btn-block" onClick={handleLogout} style={{ borderColor: "#4a5148", color: "#d8d3c7" }}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="container main-inner">{children}</div>
      </main>
    </div>
  );
}
