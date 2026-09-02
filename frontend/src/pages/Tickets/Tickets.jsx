import { useEffect, useState } from "react";
import { getTickets } from "../../api/tickets";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await getTickets();

        setTickets(data);
      } catch (error) {
        console.error("Erro ao carregar tickets:", error);

        setError("Não foi possível carregar os tickets.");
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  if (loading) {
    return <p>Carregando tickets...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Tickets</h1>

      {tickets.length === 0 ? (
        <p>Nenhum ticket encontrado.</p>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.uuid}>
            <h2>{ticket.title}</h2>

            <p>
              {ticket.description}
            </p>

            <p>
              Categoria: {ticket.category}
            </p>

            <p>
              Status: {ticket.status}
            </p>

            <p>
              Prioridade: {ticket.priority}
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Tickets;