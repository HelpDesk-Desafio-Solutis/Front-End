import api from "./api";

export async function getTickets() {
  const response = await api.get("/api/tickets");
  return response.data;
}

export async function getTicketsByStatus(status) {
  const response = await api.get("/api/tickets", {
    params: {
      status,
    },
  });

  return response.data;
}

export async function getTicketsByClient(clientId) {
  const response = await api.get(`/api/tickets/client/${clientId}`);
  return response.data;
}

export async function getTicketsByTechnician(technicianId) {
  const response = await api.get(
    `/api/tickets/technician/${technicianId}`
  );

  return response.data;
}

export async function getTicketById(ticketId) {
  const response = await api.get(`/api/tickets/${ticketId}`);
  return response.data;
}

export async function getAvailableTickets() {
  const response = await api.get("/api/tickets/available");
  return response.data;
}

export async function createTicket(ticket) {
  const response = await api.post("/api/tickets", ticket);
  return response.data;
}

export async function createTicketAdmin(ticket) {
  const response = await api.post("/api/tickets/admin", ticket);
  return response.data;
}

export async function updateTicket(ticketId, ticket) {
  const response = await api.put(
    `/api/tickets/${ticketId}`,
    ticket
  );

  return response.data;
}

export async function deactivateTicket(ticketId) {
  await api.delete(`/api/tickets/${ticketId}`);
}