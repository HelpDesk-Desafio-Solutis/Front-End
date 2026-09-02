import api from "./api";

export async function login(email, password) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    console.log("LOGIN OK");
    console.log("Status:", response.status);
    console.log("Resposta:", response.data);

    return response.data;
  } catch (error) {
    console.error("ERRO NO LOGIN");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Resposta:", error.response.data);
    } else if (error.request) {
      console.error("O servidor não respondeu.");
    } else {
      console.error("Erro:", error.message);
    }

    throw error;
  }
}