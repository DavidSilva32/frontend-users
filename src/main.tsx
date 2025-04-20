import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import "./index.css";
import UserList from "./pages/userList";
import { AuthProvider } from "./AuthContext";
import Login from "./pages/Login";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{ duration: 3000, position: "bottom-center" }}
        />
        <Routes>
          {/* Rota principal */}
          <Route path="/" element={<App />}>
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Rota de usuários (protegida) */}
            <Route path="userList" element={<UserList />} />
          </Route>

          {/* Rota para o 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
