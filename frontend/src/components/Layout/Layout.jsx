import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>HelpDesk</h1>
        </div>

        <div className="user-info">
          <strong>{user?.name}</strong>

          <span>{user?.role}</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/tickets"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Tickets
          </NavLink>

          {user?.role === "ADMIN" && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Usuários
            </NavLink>
          )}

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Notificações
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;