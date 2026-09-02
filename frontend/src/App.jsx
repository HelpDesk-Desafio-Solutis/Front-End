import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Tickets from "./pages/Tickets/Tickets";
import TicketDetails from "./pages/Tickets/TicketDetails";
import Users from "./pages/Users";
import Notifications from "./pages/Notifications/Notifications";

import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/tickets"
            element={<Tickets />}
          />

          <Route
            path="/users"
            element={<Users />}
          />
        </Route>

        <Route
          path="/tickets/:id"
          element={<TicketDetails />}
        />
      
        <Route 
          path="/notifications" 
          element={<Notifications />}
        />
      </Route>

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default App;