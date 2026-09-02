import { useEffect, useState } from "react";
import { getNotifications } from "../../api/notifications";
import "../../styles/notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
      setError("Não foi possível carregar as notificações.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("pt-BR");
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Notificações</h1>
          <p>Acompanhe os eventos relacionados aos chamados.</p>
        </div>

        <button
          type="button"
          className="notifications-refresh-button"
          onClick={loadNotifications}
          disabled={loading}
        >
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
      </div>

      {loading && (
        <div className="notifications-message">
          Carregando notificações...
        </div>
      )}

      {error && (
        <div className="notifications-message notifications-error">
          {error}
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="notifications-message">
          Nenhuma notificação encontrada.
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              className="notification-card"
              key={notification.uuid}
            >
              <div className="notification-icon">
                🔔
              </div>

              <div className="notification-content">
                <div className="notification-top">
                  <h2>
                    {notification.type || "Notificação"}
                  </h2>

                  <span className="notification-date">
                    {formatDate(
                      notification.createdAt ||
                      notification.timestamp ||
                      notification.date
                    )}
                  </span>
                </div>

                <p>
                  {notification.message ||
                    notification.description ||
                    "Evento registrado no sistema."}
                </p>

                {notification.ticketUuid && (
                  <span className="notification-ticket">
                    Ticket: {notification.ticketUuid}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;