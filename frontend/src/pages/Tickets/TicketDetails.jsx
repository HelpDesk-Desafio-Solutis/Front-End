import { useEffect, useState } from "react";
import {
  getTicketById,
  updateTicket,
  deactivateTicket,
} from "../../api/tickets";
import { getUsers } from "../../api/users";
import { useAuth } from "../../context/AuthContext";

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

const statuses = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING",
  "RESOLVED",
];

const priorities = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

function TicketDetails({
  ticketId,
  onClose,
  onTicketUpdated,
}) {
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [technicianUuid, setTechnicianUuid] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const [closing, setClosing] = useState(false);
  const [closeError, setCloseError] = useState("");
  const [showCloseConfirmation, setShowCloseConfirmation] =
    useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  const canEdit =
    user?.role === "ADMIN" ||
    user?.role === "TECHNICIAN";

  const normalizedStatus = ticket?.status?.toUpperCase();

  async function loadTicket() {
    setLoading(true);
    setError("");

    try {
      const data = await getTicketById(ticketId);

      setTicket(data);

      setDescription(data.description || "");
      setCategory(data.category || "");
      setStatus(data.status || "");
      setPriority(data.priority || "");
      setTechnicianUuid(data.technician?.uuid || "");
    } catch (error) {
      console.error(
        "Erro ao carregar ticket:",
        error
      );

      setError(
        "Não foi possível carregar os detalhes do ticket."
      );
    } finally {
      setLoading(false);
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
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadUsers();
    }
  }, [user]);

  const technicians = users.filter(
    (item) => item.role === "TECHNICIAN"
  );

  function handleStartEditing() {
    if (!ticket) {
      return;
    }

    setDescription(ticket.description || "");
    setCategory(ticket.category || "");
    setStatus(ticket.status || "");
    setPriority(ticket.priority || "");
    setTechnicianUuid(
      ticket.technician?.uuid || ""
    );

    setSaveError("");
    setSaveSuccess("");

    setEditing(true);
  }

  function handleCancelEditing() {
    setEditing(false);
    setSaveError("");
    setSaveSuccess("");

    if (ticket) {
      setDescription(ticket.description || "");
      setCategory(ticket.category || "");
      setStatus(ticket.status || "");
      setPriority(ticket.priority || "");
      setTechnicianUuid(
        ticket.technician?.uuid || ""
      );
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      const updateData = {
        description: description || null,
        category: category || null,
        status: status || null,
        priority: priority || null,
        technicianUuid:
          user?.role === "ADMIN"
            ? technicianUuid || null
            : null,
      };

      const updatedTicket = await updateTicket(
        ticketId,
        updateData
      );

      setTicket(updatedTicket);

      setStatus(
        updatedTicket.status || ""
      );

      setPriority(
        updatedTicket.priority || ""
      );

      setDescription(
        updatedTicket.description || ""
      );

      setCategory(
        updatedTicket.category || ""
      );

      setTechnicianUuid(
        updatedTicket.technician?.uuid || ""
      );

      setEditing(false);
      setSaveSuccess(
        "Ticket atualizado com sucesso!"
      );

      if (onTicketUpdated) {
        await onTicketUpdated();
      }
    } catch (error) {
      console.error(
        "Erro ao atualizar ticket:",
        error
      );

      if (error.response?.data?.message) {
        setSaveError(
          error.response.data.message
        );
      } else {
        setSaveError(
          "Não foi possível atualizar o ticket."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    setClosing(true);
    setCloseError("");

    try {
      await deactivateTicket(ticketId);

      setShowCloseConfirmation(false);

      if (onTicketUpdated) {
        await onTicketUpdated();
      }

      onClose();
    } catch (error) {
      console.error(
        "Erro ao fechar ticket:",
        error
      );

      if (error.response?.data?.message) {
        setCloseError(
          error.response.data.message
        );
      } else {
        setCloseError(
          "Não foi possível fechar o ticket."
        );
      }
    } finally {
      setClosing(false);
    }
  }

  function formatDate(date) {
    if (!date) {
      return "Não informado";
    }

    return new Date(date).toLocaleString(
      "pt-BR"
    );
  }

  return (
    <div
      className="ticket-modal-overlay"
      onClick={onClose}
    >
      <div
        className="ticket-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          className="ticket-modal-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>

        {loading && (
          <p>
            Carregando detalhes do ticket...
          </p>
        )}

        {!loading && error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          ticket && (
            <>
              <div className="ticket-modal-header">
                <div>
                  <span className="ticket-modal-label">
                    Ticket
                  </span>

                  <h2>{ticket.title}</h2>
                </div>

                <span className="ticket-status">
                  {statusLabels[ticket.status] ||
                    ticket.status}
                </span>
              </div>

              {!editing ? (
                <div className="ticket-details-view">
                  <div className="ticket-modal-section">
                    <h3>Descrição</h3>

                    <p>
                      {ticket.description ||
                        "Nenhuma descrição informada."}
                    </p>
                  </div>

                  <div className="ticket-modal-info">
                    <div>
                      <strong>
                        Categoria
                      </strong>

                      <span>
                        {categoryLabels[
                          ticket.category
                        ] ||
                          ticket.category ||
                          "Não informado"}
                      </span>
                    </div>

                    <div>
                      <strong>
                        Prioridade
                      </strong>

                      <span>
                        {priorityLabels[
                          ticket.priority
                        ] ||
                          ticket.priority ||
                          "Não informado"}
                      </span>
                    </div>

                    <div>
                      <strong>Status</strong>

                      <span>
                        {statusLabels[
                          ticket.status
                        ] ||
                          ticket.status ||
                          "Não informado"}
                      </span>
                    </div>
                  </div>

                  <div className="ticket-modal-section">
                    <h3>Cliente</h3>

                    {ticket.client ? (
                      <>
                        <p>
                          <strong>
                            {ticket.client.name}
                          </strong>
                        </p>

                        <p>
                          {ticket.client.email}
                        </p>
                      </>
                    ) : (
                      <p>
                        Cliente não informado.
                      </p>
                    )}
                  </div>

                  <div className="ticket-modal-section">
                    <h3>Técnico</h3>

                    {ticket.technician ? (
                      <>
                        <p>
                          <strong>
                            {
                              ticket.technician
                                .name
                            }
                          </strong>
                        </p>

                        <p>
                          {
                            ticket.technician
                              .email
                          }
                        </p>
                      </>
                    ) : (
                      <p>
                        Nenhum técnico atribuído.
                      </p>
                    )}
                  </div>

                  <div className="ticket-modal-info">
                    <div>
                      <strong>
                        Criado em
                      </strong>

                      <span>
                        {formatDate(
                          ticket.createdAt
                        )}
                      </span>
                    </div>

                    <div>
                      <strong>
                        Atualizado em
                      </strong>

                      <span>
                        {formatDate(
                          ticket.updatedAt
                        )}
                      </span>
                    </div>
                  </div>

                  {saveSuccess && (
                    <div className="success-message">
                      {saveSuccess}
                    </div>
                  )}

                  {canEdit && (
                    <div className="ticket-modal-actions">
                      <button
                        type="button"
                        className="edit-ticket-button"
                        onClick={
                          handleStartEditing
                        }
                        disabled={
                          normalizedStatus ===
                          "CLOSED"
                        }
                      >
                        Editar ticket
                      </button>

                      {normalizedStatus ===
                        "RESOLVED" && (
                        <button
                          type="button"
                          className="close-ticket-button"
                          onClick={() => {
                            setCloseError("");
                            setShowCloseConfirmation(
                              true
                            );
                          }}
                          disabled={closing}
                        >
                          Fechar ticket
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="ticket-edit-form">
                  <h3>Editar ticket</h3>

                  <div className="ticket-edit-field">
                    <label htmlFor="ticket-description">
                      Descrição
                    </label>

                    <textarea
                      id="ticket-description"
                      value={description}
                      onChange={(event) =>
                        setDescription(
                          event.target.value
                        )
                      }
                      maxLength={250}
                      rows={5}
                      placeholder="Descreva o problema"
                    />
                  </div>

                  <div className="ticket-edit-field">
                    <label htmlFor="ticket-category">
                      Categoria
                    </label>

                    <select
                      id="ticket-category"
                      value={category}
                      onChange={(event) =>
                        setCategory(
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        Selecione uma categoria
                      </option>

                      <option value="HARDWARE">
                        Hardware
                      </option>

                      <option value="SOFTWARE">
                        Software
                      </option>

                      <option value="NETWORK">
                        Rede
                      </option>
                    </select>
                  </div>

                  <div className="ticket-edit-field">
                    <label htmlFor="ticket-status">
                      Status
                    </label>

                    <select
                      id="ticket-status"
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target.value
                        )
                      }
                    >
                      {statuses.map((item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {statusLabels[item]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ticket-edit-field">
                    <label htmlFor="ticket-priority">
                      Prioridade
                    </label>

                    <select
                      id="ticket-priority"
                      value={priority}
                      onChange={(event) =>
                        setPriority(
                          event.target.value
                        )
                      }
                    >
                      {priorities.map((item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {priorityLabels[item]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {user?.role ===
                    "TECHNICIAN" && (
                    <div className="ticket-edit-info">
                      <strong>
                        Técnico responsável
                      </strong>

                      <p>
                        Você está editando este
                        ticket como técnico.
                      </p>

                      <small>
                        O ticket será atribuído
                        automaticamente ao seu
                        usuário.
                      </small>
                    </div>
                  )}

                  {user?.role === "ADMIN" && (
                    <div className="ticket-edit-field">
                      <label htmlFor="ticket-technician">
                        Técnico
                      </label>

                      <select
                        id="ticket-technician"
                        value={technicianUuid}
                        onChange={(event) =>
                          setTechnicianUuid(
                            event.target.value
                          )
                        }
                        disabled={usersLoading}
                      >
                        <option value="">
                          {usersLoading
                            ? "Carregando técnicos..."
                            : "Nenhum técnico"}
                        </option>

                        {technicians.map(
                          (technician) => (
                            <option
                              key={
                                technician.uuid
                              }
                              value={
                                technician.uuid
                              }
                            >
                              {technician.name} —{" "}
                              {technician.email}
                            </option>
                          )
                        )}
                      </select>

                      {usersError && (
                        <small className="form-error">
                          {usersError}
                        </small>
                      )}
                    </div>
                  )}

                  {saveError && (
                    <div className="error-message">
                      {saveError}
                    </div>
                  )}

                  <div className="ticket-modal-actions">
                    <button
                      type="button"
                      className="cancel-ticket-button"
                      onClick={
                        handleCancelEditing
                      }
                      disabled={saving}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="save-ticket-button"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving
                        ? "Salvando..."
                        : "Salvar alterações"}
                    </button>
                  </div>
                </div>
              )}

              {showCloseConfirmation && (
                <div
                  className="ticket-confirm-overlay"
                  onClick={() => {
                    if (!closing) {
                      setShowCloseConfirmation(
                        false
                      );
                    }
                  }}
                >
                  <div
                    className="ticket-confirm-modal"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    <h3>Fechar ticket</h3>

                    <p>
                      Tem certeza que deseja
                      fechar este ticket?
                    </p>

                    <p>
                      Ao fechar o ticket, ele será
                      desativado e não aparecerá
                      mais entre os tickets ativos.
                    </p>

                    {closeError && (
                      <div className="error-message">
                        {closeError}
                      </div>
                    )}

                    <div className="ticket-modal-actions">
                      <button
                        type="button"
                        className="cancel-ticket-button"
                        onClick={() =>
                          setShowCloseConfirmation(
                            false
                          )
                        }
                        disabled={closing}
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        className="close-ticket-button"
                        onClick={
                          handleDeactivate
                        }
                        disabled={closing}
                      >
                        {closing
                          ? "Fechando..."
                          : "Confirmar fechamento"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="ticket-modal-footer"></div>
            </>
          )}
      </div>
    </div>
  );
}

export default TicketDetails;