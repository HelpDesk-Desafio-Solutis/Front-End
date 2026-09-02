import api from "./api";

export async function getTickets() {
  const response = await api.get("/api/tickets");

  return response.data;
}