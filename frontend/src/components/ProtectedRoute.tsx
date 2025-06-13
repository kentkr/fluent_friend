import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isLoggedIn } from "../api/auth";


function ProtectedRoute({ children }: { children: any }) {
  const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null);

  // on mount get authorization
  useEffect(() => {
    const getAuth = async () => {
      setIsAuthorized(await isLoggedIn())
    }
    getAuth()
  }, [])

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
