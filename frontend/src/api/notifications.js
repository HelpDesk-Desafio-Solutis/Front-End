import api from "./api";

export async function getNotifications() {
  const response = await api.get("/api/notifications");
  return response.data;
}

export async function getNotificationById(notificationId) {
  const response = await api.get(`/api/notifications/${notificationId}`);
  return response.data;
}