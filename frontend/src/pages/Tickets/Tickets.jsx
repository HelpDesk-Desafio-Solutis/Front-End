import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  createTicket,
  createTicketAdmin,
  getTickets,
  getTicketsByClient,
  getTicketsByTechnician,
  getAvailableTickets,
} from "../../api/tickets";
import TicketDetails from "../Tickets/TicketDetails";
import { getUsers } from "../../api/users";

const categories = [
  "HARDWARE",
  "SOFTWARE",
  "NETWORK",
];

const priorities = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

const statusLabels = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  WAITING: "Aguardando",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado",
};

const categoryLabels = {
  HARDWARE: "Hardware",
  SOFTWARE: "Software",
  NETWORK: "Rede",
};

const priorityLabels = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  CRITICAL: "Crítica",
};

function Tickets() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [availableLoading, setAvailableLoading] =
    useState(false);
  const [error, setError] = useState("");
  const [availableError, setAvailableError] =
    useState("");

  const [activeSection, setActiveSection] =
    useState("tickets");

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  const [clientUuid, setClientUuid] =
    useState("");
  const [technicianUuid, setTechnicianUuid] =
    useState("");

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] =
    useState("");
  const [createSuccess, setCreateSuccess] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("TODOS");

  const [categoryFilter, setCategoryFilter] =
    useState("TODAS");

  const [priorityFilter, setPriorityFilter] =
    useState("TODAS");

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] =
    useState(false);
  const [usersError, setUsersError] =
    useState("");

  async function loadTickets(
    showLoading = true
  ) {
    if (!user?.uuid || !user?.role) {
      return;
    }

    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");

    try {
      let data;

      if (user.role === "CLIENT") {
        data = await getTicketsByClient(
          user.uuid
        );
      } else if (
        user.role === "TECHNICIAN"
      ) {
        data = await getTicketsByTechnician(
          user.uuid
        );
      } else if (user.role === "ADMIN") {
        data = await getTickets();
      } else {
        throw new Error(
          "Perfil de usuário não suportado."
        );
      }

      setTickets(data);
    } catch (error) {
      console.error(
        "Erro ao carregar tickets:",
        error
      );

      setError(
        "Não foi possível carregar os tickets."
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }

  async function loadAvailableTickets() {
    if (
      user?.role !== "ADMIN" &&
      user?.role !== "TECHNICIAN"
    ) {
      return;
    }

    setAvailableLoading(true);
    setAvailableError("");

    try {
      const data = await getAvailableTickets();
      setAvailableTickets(data);
    } catch (error) {
      console.error(
        "Erro ao carregar tickets disponíveis:",
        error
      );

      setAvailableError(
        "Não foi possível carregar os tickets disponíveis."
      );
    } finally {
      setAvailableLoading(false);
    }
  }

  async function loadUsers() {
    setUsersLoading(true);
    setUsersError("");

    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(
        "Erro ao carregar usuários:",
        error
      );

      setUsersError(
        "Não foi possível carregar os usuários."
      );
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    if (user?.uuid && user?.role) {
      loadTickets(true);
    }
  }, [user]);

  useEffect(() => {
    if (
      user?.role === "ADMIN" ||
      user?.role === "TECHNICIAN"
    ) {
      loadUsers();
    }
  }, [user]);

  useEffect(() => {
    if (
      activeSection === "available" &&
      (user?.role === "ADMIN" ||
        user?.role === "TECHNICIAN")
    ) {
      loadAvailableTickets();
    }
  }, [activeSection, user]);

  const filteredTickets = tickets.filter(
    (ticket) => {
      const matchesStatus =
        statusFilter === "TODOS" ||
        ticket.status === statusFilter;

      const matchesCategory =
        categoryFilter === "TODAS" ||
        ticket.category === categoryFilter;

      const matchesPriority =
        priorityFilter === "TODAS" ||
        ticket.priority === priorityFilter;

      return (
        matchesStatus &&
        matchesCategory &&
        matchesPriority
      );
    }
  );

  const clients = users.filter(
    (item) => item.role === "CLIENT"
  );

  const technicians = users.filter(
    (item) => item.role === "TECHNICIAN"
  );

  function clearForm() {
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("");
    setClientUuid("");
    setTechnicianUuid("");
    setCreateError("");
    setCreateSuccess("");
  }

  async function handleCreateTicket(event) {
    event.preventDefault();

    setCreating(true);
    setCreateError("");
    setCreateSuccess("");

    try {
      const ticket = {
        title,
        description,
        category,
        priority,
      };

      if (user.role === "CLIENT") {
        await createTicket(ticket);
      } else if (user.role === "TECHNICIAN") {
        await createTicketAdmin({
          ...ticket,
          clientUuid,
          technicianUuid: user.uuid,
        });
      } else if (user.role === "ADMIN") {
        await createTicketAdmin({
          ...ticket,
          clientUuid,
          technicianUuid:
            technicianUuid || null,
        });
      }

      clearForm();

      setCreateSuccess(
        "Ticket criado com sucesso!"
      );

      await loadTickets(false);
    } catch (error) {
      console.error(
        "Erro ao criar ticket:",
        error
      );

      if (error.response?.data?.message) {
        setCreateError(
          error.response.data.message
        );
      } else {
        setCreateError(
          "Não foi possível criar o ticket."
        );
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleTicketUpdated() {
    await loadTickets(false);

    if (activeSection === "available") {
      await loadAvailableTickets();
    }
  }

  return (
    <div className="tickets-page">
      <div className="page-header">
        <div>
          <h1>Tickets</h1>

          <p>
            {user?.role === "CLIENT" &&
              "Consulte seus chamados e abra um novo ticket."}

            {user?.role === "TECHNICIAN" &&
              "Consulte os chamados atribuídos a você e gerencie novos tickets."}

            {user?.role === "ADMIN" && "Gerencie todos os chamados do sistema."}
          </p>
        </div>
      </div>

      <div className="tickets-tabs">
        <button
          type="button"
          className={
            activeSection === "tickets" ? "tickets-tab active" : "tickets-tab"
          }
          onClick={() => setActiveSection("tickets")}
        >
          {user?.role === "ADMIN" ? "Todos os Tickets" : "Meus Tickets"}
        </button>

        <button
          type="button"
          className={
            activeSection === "create" ? "tickets-tab active" : "tickets-tab"
          }
          onClick={() => setActiveSection("create")}
        >
          Criar Ticket
        </button>

        {(user?.role === "ADMIN" || user?.role === "TECHNICIAN") && (
          <button
            type="button"
            className={
              activeSection === "available"
                ? "tickets-tab active"
                : "tickets-tab"
            }
            onClick={() => setActiveSection("available")}
          >
            Tickets disponíveis
          </button>
        )}
      </div>

      {activeSection === "tickets" && (
        <section className="tickets-section">
          <div className="ticket-filters">
            <div className="ticket-filter">
              <label htmlFor="status-filter">Status</label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="TODOS">Todos</option>

                <option value="OPEN">Aberto</option>

                <option value="IN_PROGRESS">Em andamento</option>

                <option value="WAITING">Aguardando</option>

                <option value="RESOLVED">Resolvido</option>

                <option value="CLOSED">Fechado</option>
              </select>
            </div>

            <div className="ticket-filter">
              <label htmlFor="category-filter">Categoria</label>

              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="TODAS">Todas</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {categoryLabels[item]}
                  </option>
                ))}
              </select>
            </div>

            <div className="ticket-filter">
              <label htmlFor="priority-filter">Prioridade</label>

              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="TODAS">Todas</option>

                {priorities.map((item) => (
                  <option key={item} value={item}>
                    {priorityLabels[item]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="tickets-list-header">
            <h2>
              {filteredTickets.length}{" "}
              {filteredTickets.length === 1 ? "ticket" : "tickets"}
            </h2>

            {refreshing && (
              <span className="ticket-refreshing">Atualizando...</span>
            )}
          </div>

          {loading && <p>Carregando tickets...</p>}

          {!loading && error && <div className="error-message">{error}</div>}

          {!loading && !error && filteredTickets.length === 0 && (
            <div className="empty-state">
              <h2>Nenhum ticket encontrado</h2>

              <p>
                {statusFilter === "TODOS" &&
                categoryFilter === "TODAS" &&
                priorityFilter === "TODAS"
                  ? "Ainda não existem tickets relacionados ao seu perfil."
                  : "Não existem tickets com os filtros selecionados."}
              </p>
            </div>
          )}

          {!loading && !error && filteredTickets.length > 0 && (
            <div className="tickets-list">
              {filteredTickets.map((ticket) => (
                <article
                  className="ticket-card"
                  key={ticket.uuid}
                  onClick={() => setSelectedTicketId(ticket.uuid)}
                >
                  <div className="ticket-card-header">
                    <div>
                      <h2>{ticket.title}</h2>

                      <span className="ticket-id">{ticket.uuid}</span>
                    </div>

                    <span className="ticket-status">
                      {statusLabels[ticket.status] || ticket.status}
                    </span>
                  </div>

                  <p className="ticket-description">{ticket.description}</p>

                  <div className="ticket-info">
                    <div>
                      <span>Categoria</span>

                      <strong>
                        {categoryLabels[ticket.category] || ticket.category}
                      </strong>
                    </div>

                    <div>
                      <span>Prioridade</span>

                      <strong>
                        {priorityLabels[ticket.priority] || ticket.priority}
                      </strong>
                    </div>

                    {ticket.client && (
                      <div>
                        <span>Cliente</span>

                        <strong>{ticket.client.name}</strong>
                      </div>
                    )}

                    {ticket.technician && (
                      <div>
                        <span>Técnico</span>

                        <strong>{ticket.technician.name}</strong>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "create" && (
        <section className="create-ticket-section">
          <h2>Novo Ticket</h2>

          <form onSubmit={handleCreateTicket}>
            <div className="form-group">
              <label htmlFor="title">Título</label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={80}
                placeholder="Digite o título do chamado"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição</label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={250}
                placeholder="Descreva o problema"
                rows={5}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Categoria</label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                >
                  <option value="">Selecione</option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {categoryLabels[item]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority">Prioridade</label>

                <select
                  id="priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  required
                >
                  <option value="">Selecione</option>

                  {priorities.map((item) => (
                    <option key={item} value={item}>
                      {priorityLabels[item]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(user?.role === "ADMIN" || user?.role === "TECHNICIAN") && (
              <>
                <div className="form-group">
                  <label htmlFor="clientUuid">Cliente</label>

                  <select
                    id="clientUuid"
                    value={clientUuid}
                    onChange={(event) => setClientUuid(event.target.value)}
                    required
                    disabled={usersLoading}
                  >
                    <option value="">
                      {usersLoading
                        ? "Carregando clientes..."
                        : "Selecione um cliente"}
                    </option>

                    {clients.map((client) => (
                      <option key={client.uuid} value={client.uuid}>
                        {client.name} - {client.email}
                      </option>
                    ))}
                  </select>
                </div>

                {user?.role === "ADMIN" && (
                  <div className="form-group">
                    <label htmlFor="technicianUuid">Técnico</label>

                    <select
                      id="technicianUuid"
                      value={technicianUuid}
                      onChange={(event) =>
                        setTechnicianUuid(event.target.value)
                      }
                      disabled={usersLoading}
                    >
                      <option value="">
                        {usersLoading
                          ? "Carregando técnicos..."
                          : "Nenhum técnico"}
                      </option>

                      {technicians.map((technician) => (
                        <option key={technician.uuid} value={technician.uuid}>
                          {technician.name} - {technician.email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {user?.role === "TECHNICIAN" && (
                  <div className="ticket-edit-info">
                    <strong>Técnico responsável</strong>

                    <p>Este ticket será atribuído automaticamente a você.</p>
                  </div>
                )}
              </>
            )}

            {createError && <div className="error-message">{createError}</div>}

            {createSuccess && (
              <div className="success-message">{createSuccess}</div>
            )}

            <button type="submit" disabled={creating}>
              {creating ? "Criando..." : "Criar Ticket"}
            </button>
          </form>
        </section>
      )}

      {activeSection === "available" && (
        <section className="tickets-section">
          <div className="tickets-list-header">
            <h2>
              {availableTickets.length}{" "}
              {availableTickets.length === 1
                ? "ticket disponível"
                : "tickets disponíveis"}
            </h2>

            {availableLoading && (
              <span className="ticket-refreshing">Atualizando...</span>
            )}
          </div>

          {availableLoading && <p>Carregando tickets disponíveis...</p>}

          {!availableLoading && availableError && (
            <div className="error-message">{availableError}</div>
          )}

          {!availableLoading &&
            !availableError &&
            availableTickets.length === 0 && (
              <div className="empty-state">
                <h2>Nenhum ticket disponível</h2>

                <p>
                  Não existem tickets abertos aguardando atribuição de um
                  técnico.
                </p>
              </div>
            )}

          {!availableLoading &&
            !availableError &&
            availableTickets.length > 0 && (
              <div className="tickets-list">
                {availableTickets.map((ticket) => (
                  <article
                    className="ticket-card"
                    key={ticket.uuid}
                    onClick={() => setSelectedTicketId(ticket.uuid)}
                  >
                    <div className="ticket-card-header">
                      <div>
                        <h2>{ticket.title}</h2>

                        <span className="ticket-id">{ticket.uuid}</span>
                      </div>

                      <span className="ticket-status">
                        {statusLabels[ticket.status] || ticket.status}
                      </span>
                    </div>

                    <p className="ticket-description">{ticket.description}</p>

                    <div className="ticket-info">
                      <div>
                        <span>Categoria</span>

                        <strong>
                          {categoryLabels[ticket.category] || ticket.category}
                        </strong>
                      </div>

                      <div>
                        <span>Prioridade</span>

                        <strong>
                          {priorityLabels[ticket.priority] || ticket.priority}
                        </strong>
                      </div>

                      {ticket.client && (
                        <div>
                          <span>Cliente</span>

                          <strong>{ticket.client.name}</strong>
                        </div>
                      )}

                      <div>
                        <span>Técnico</span>

                        <strong>Não atribuído</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      )}

      {selectedTicketId && (
        <TicketDetails
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          onTicketUpdated={handleTicketUpdated}
        />
      )}
    </div>
  );
}

export default Tickets;