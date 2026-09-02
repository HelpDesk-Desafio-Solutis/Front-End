import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>

      <p>
        Bem-vindo, {user?.name}!
      </p>

      <p>
        Você está conectado como{" "}
        <strong>{user?.role}</strong>.
      </p>
    </div>
  );
}

export default Dashboard;