import { useEffect, useState } from "react";
import { getTickets } from "../../api/tickets";
import { useAuth } from "../../context/AuthContext";
import "../../styles/dashboard.css";

function Dashboard() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getTickets();
        setTickets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        setError("Não foi possível carregar os dados da dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;

  const criticalTickets = tickets.filter(
    (ticket) => ticket.priority === "CRITICAL"
  ).length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Bem-vindo, <strong>{user?.name}</strong>.
          </p>
        </div>
      </div>

      {loading && (
        <div className="dashboard-message">
          Carregando dados...
        </div>
      )}

      {error && (
        <div className="dashboard-message dashboard-error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="dashboard-content">
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="dashboard-card-icon">📋</div>
              <div>
                <span className="dashboard-card-label">
                  Total de chamados
                </span>
                <strong className="dashboard-card-value">
                  {totalTickets}
                </strong>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">🟢</div>
              <div>
                <span className="dashboard-card-label">
                  Chamados abertos
                </span>
                <strong className="dashboard-card-value">
                  {openTickets}
                </strong>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">🔵</div>
              <div>
                <span className="dashboard-card-label">
                  Em atendimento
                </span>
                <strong className="dashboard-card-value">
                  {inProgressTickets}
                </strong>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">✅</div>
              <div>
                <span className="dashboard-card-label">
                  Chamados resolvidos
                </span>
                <strong className="dashboard-card-value">
                  {resolvedTickets}
                </strong>
              </div>
            </div>

            <div className="dashboard-card dashboard-card-critical">
              <div className="dashboard-card-icon">🔴</div>
              <div>
                <span className="dashboard-card-label">
                  Chamados críticos
                </span>
                <strong className="dashboard-card-value">
                  {criticalTickets}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;