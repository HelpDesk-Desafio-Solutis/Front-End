import api from "./api";

export async function getUsers() {
  const response = await api.get("/api/users");

  return response.data;
}

export async function createUser(user) {
  const response = await api.post("/api/users", user);

  return response.data;
}

export async function updateUser(userId, user) {
  const response = await api.put(`/api/users/${userId}`, user);

  return response.data;
}

export async function deactivateUser(userId) {
  await api.delete(`/api/users/${userId}`);
}