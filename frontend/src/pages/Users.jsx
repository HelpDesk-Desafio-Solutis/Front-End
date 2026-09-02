import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
} from "../api/users";
import "../styles/users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
  });

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setError("Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function getRoleLabel(role) {
    switch (role) {
      case "ADMIN":
        return "Administrador";

      case "TECHNICIAN":
        return "Técnico";

      case "CLIENT":
        return "Cliente";

      default:
        return role || "—";
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openCreateModal() {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "CLIENT",
    });

    setError("");
    setShowCreateModal(true);
  }

  function closeCreateModal() {
    if (creating) {
      return;
    }

    setShowCreateModal(false);
  }

  async function handleCreateUser(event) {
    event.preventDefault();

    try {
      setCreating(true);
      setError("");

      await createUser(form);

      setShowCreateModal(false);

      await loadUsers();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);

      const message = error.response?.data?.message;

      setError(
        message || "Não foi possível criar o usuário."
      );
    } finally {
      setCreating(false);
    }
  }

  function openEditModal(user) {
    setEditingUserId(user.uuid);

    setEditForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "CLIENT",
    });

    setError("");
    setShowEditModal(true);
  }

  function closeEditModal() {
    if (editing) {
      return;
    }

    setShowEditModal(false);
    setEditingUserId(null);
  }

  async function handleUpdateUser(event) {
    event.preventDefault();

    try {
      setEditing(true);
      setError("");

      await updateUser(editingUserId, editForm);

      setShowEditModal(false);
      setEditingUserId(null);

      await loadUsers();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);

      const message = error.response?.data?.message;

      setError(
        message || "Não foi possível atualizar o usuário."
      );
    } finally {
      setEditing(false);
    }
  }

  function openDeleteModal(user) {
    setDeletingUser(user);
    setError("");
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    if (deleting) {
      return;
    }

    setShowDeleteModal(false);
    setDeletingUser(null);
  }

  async function handleDeactivateUser() {
    if (!deletingUser) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deactivateUser(deletingUser.uuid);

      setShowDeleteModal(false);
      setDeletingUser(null);

      await loadUsers();
    } catch (error) {
      console.error("Erro ao desativar usuário:", error);

      const message = error.response?.data?.message;

      setError(
        message || "Não foi possível desativar o usuário."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Usuários</h1>
          <p>Gerencie os usuários cadastrados no sistema.</p>
        </div>

        <button
          type="button"
          className="users-create-button"
          onClick={openCreateModal}
        >
          Novo usuário
        </button>
      </div>

      {loading && (
        <div className="users-message">
          Carregando usuários...
        </div>
      )}

      {error &&
        !showCreateModal &&
        !showEditModal &&
        !showDeleteModal && (
          <div className="users-message users-error">
            {error}
          </div>
        )}

      {!loading && !error && (
        <div className="users-table-container">
          {users.length === 0 ? (
            <div className="users-message">
              Nenhum usuário encontrado.
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.uuid}>
                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`user-role role-${user.role?.toLowerCase()}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </td>

                    <td>
                      <div className="users-actions">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => openDeleteModal(user)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal de criação */}

      {showCreateModal && (
        <div
          className="users-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeCreateModal();
            }
          }}
        >
          <div className="users-modal">
            <button
              type="button"
              className="users-modal-close"
              onClick={closeCreateModal}
              disabled={creating}
            >
              ×
            </button>

            <div className="users-modal-header">
              <h2>Novo usuário</h2>
              <p>Cadastre um novo usuário no sistema.</p>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="users-form-field">
                <label htmlFor="name">Nome</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={80}
                  required
                  disabled={creating}
                  placeholder="Digite o nome"
                />
              </div>

              <div className="users-form-field">
                <label htmlFor="email">E-mail</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={80}
                  required
                  disabled={creating}
                  placeholder="Digite o e-mail"
                />
              </div>

              <div className="users-form-field">
                <label htmlFor="password">Senha</label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                  disabled={creating}
                  placeholder="Mínimo de 6 caracteres"
                />
              </div>

              <div className="users-form-field">
                <label htmlFor="role">Perfil</label>

                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={creating}
                >
                  <option value="CLIENT">Cliente</option>
                  <option value="TECHNICIAN">Técnico</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              {error && (
                <div className="users-form-error">
                  {error}
                </div>
              )}

              <div className="users-modal-actions">
                <button
                  type="button"
                  className="users-cancel-button"
                  onClick={closeCreateModal}
                  disabled={creating}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="users-save-button"
                  disabled={creating}
                >
                  {creating ? "Criando..." : "Criar usuário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edição */}

      {showEditModal && (
        <div
          className="users-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditModal();
            }
          }}
        >
          <div className="users-modal">
            <button
              type="button"
              className="users-modal-close"
              onClick={closeEditModal}
              disabled={editing}
            >
              ×
            </button>

            <div className="users-modal-header">
              <h2>Editar usuário</h2>
              <p>Atualize as informações do usuário.</p>
            </div>

            <form onSubmit={handleUpdateUser}>
              <div className="users-form-field">
                <label htmlFor="edit-name">Nome</label>

                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  value={editForm.name}
                  onChange={handleEditChange}
                  maxLength={80}
                  required
                  disabled={editing}
                />
              </div>

              <div className="users-form-field">
                <label htmlFor="edit-email">E-mail</label>

                <input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  maxLength={80}
                  required
                  disabled={editing}
                />
              </div>

              <div className="users-form-field">
                <label htmlFor="edit-password">
                  Nova senha
                </label>

                <input
                  id="edit-password"
                  name="password"
                  type="password"
                  value={editForm.password}
                  onChange={handleEditChange}
                  minLength={6}
                  required
                  disabled={editing}
                  placeholder="Digite a nova senha"
                />
              </div>

              <div className="users-form-field">
                <label htmlFor="edit-role">Perfil</label>

                <select
                  id="edit-role"
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  disabled={editing}
                >
                  <option value="CLIENT">Cliente</option>
                  <option value="TECHNICIAN">Técnico</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              {error && (
                <div className="users-form-error">
                  {error}
                </div>
              )}

              <div className="users-modal-actions">
                <button
                  type="button"
                  className="users-cancel-button"
                  onClick={closeEditModal}
                  disabled={editing}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="users-save-button"
                  disabled={editing}
                >
                  {editing
                    ? "Salvando..."
                    : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de desativação */}

      {showDeleteModal && deletingUser && (
        <div
          className="users-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div className="users-delete-modal">
            <h2>Desativar usuário</h2>

            <p>
              Tem certeza que deseja desativar o usuário{" "}
              <strong>{deletingUser.name}</strong>?
            </p>

            <p className="users-delete-warning">
              O usuário não poderá mais utilizar o sistema.
            </p>

            {error && (
              <div className="users-form-error">
                {error}
              </div>
            )}

            <div className="users-modal-actions">
              <button
                type="button"
                className="users-cancel-button"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="users-delete-confirm-button"
                onClick={handleDeactivateUser}
                disabled={deleting}
              >
                {deleting
                  ? "Desativando..."
                  : "Desativar usuário"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;