import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/user/Profile";
import { Toaster } from "react-hot-toast";
import "./index.css";
import UserList from "./pages/admin/userList";
import { AuthProvider } from "./AuthContext";
import Login from "./pages/auth/Login";
import EditUser from "./pages/admin/EditUser";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{ duration: 3000, position: "bottom-center" }}
        />
        <Routes>
          <Route path="/" element={<App />}>
            {/* Auth routes */}
            <Route path="auth/login" element={<Login />} />
            <Route path="auth/register" element={<Register />} />
            {/* User self-management */}
            <Route path="user/profile" element={<Profile />} />
            {/* Admin section */}
            <Route path="admin/users" element={<UserList />} />
            <Route path="admin/users/edit/:id" element={<EditUser />} />{" "}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
