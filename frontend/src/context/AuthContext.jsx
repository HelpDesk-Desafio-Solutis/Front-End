import { createContext, useContext, useState } from "react";
import { login as loginRequest } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  async function login(email, password) {
    const data = await loginRequest(email, password);

    const userData = {
      uuid: data.uuid,
      name: data.name,
      email: data.email,
      role: data.role,
      token: data.token,
      type: data.type,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    return userData;
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}