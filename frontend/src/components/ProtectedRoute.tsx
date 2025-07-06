import { Navigate, useLocation } from "react-router-dom";
import {useAuth} from "./authprovider/AuthProvider";


function ProtectedRoute({ children }: { children: any }) {
  const { loggedIn, loading } = useAuth()
  // location of previous url
  const location = useLocation()

  if (loading) {
    return <div>Loading...</div>;
  }

  return loggedIn ? children : <Navigate to={`/login?redirect=${location.pathname}`} />;
}

export default ProtectedRoute;
