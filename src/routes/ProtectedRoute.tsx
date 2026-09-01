import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  if (carregando) return <div className="auth-loading">Verificando autenticação...</div>;
  if (!usuario || usuario.isAnonymous) return <Navigate to="/login" replace state={{ de: location.pathname }} />;

  return <>{children}</>;
}
