import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!token) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/products" />;

  return children;
};

export default AdminRoute;
