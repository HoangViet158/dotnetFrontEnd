import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole?: "admin" | "staff"; // quyền cần kiểm tra
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Nếu chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có role cần kiểm tra
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />; // chuyển về trang home nếu không đủ quyền
  }

  // Nếu đủ quyền hoặc không yêu cầu role, render component con
  return <Outlet />;
};

export default ProtectedRoute;
