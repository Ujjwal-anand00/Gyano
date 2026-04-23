import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: JSX.Element;
  allowedRoles?: string[];
};

function ProtectedRoute({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "teacher") {
      return <Navigate to="/teacher" replace />;
    }

    return <Navigate to="/student" replace />;
  }

  return children;
}

export default ProtectedRoute;
