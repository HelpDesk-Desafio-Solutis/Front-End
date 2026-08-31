import api from "./api";

export async function testGateway() {
  try {
    const response = await api.get("/api/users");

    console.log("Gateway respondeu:");
    console.log("Status:", response.status);
    console.log("Dados:", response.data);

    return response.data;

  } catch (error) {
    console.error("Erro ao acessar o Gateway:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Resposta:", error.response.data);
    } else if (error.request) {
      console.error("O Gateway não respondeu.");
    } else {
      console.error("Erro:", error.message);
    }

    throw error;
  }
}