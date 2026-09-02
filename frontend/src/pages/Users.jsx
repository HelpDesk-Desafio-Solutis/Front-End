import { useEffect, useState } from "react";
import { getUsers } from "../api/users";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Usuários</h1>
          <p>Gerencie os usuários cadastrados no sistema.</p>
        </div>

        <button type="button" className="users-create-button">
          Novo usuário
        </button>
      </div>

      {loading && <div className="users-message">Carregando usuários...</div>}

      {error && <div className="users-message users-error">{error}</div>}

      {!loading && !error && (
        <div className="users-table-container">
          {users.length === 0 ? (
            <div className="users-message">Nenhum usuário encontrado.</div>
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
                        <button type="button">Editar</button>

                        <button type="button" className="delete-button">
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
    </div>
  );
}