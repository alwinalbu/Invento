import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

function PublicWrapper({ children }) {
  const auth = useContext(AuthContext);

  // If already logged in → redirect away from login/register
  if (auth.user) {
    return <Navigate to="/" replace />;
  }

  // Otherwise allow access
  return children;
}

export default PublicWrapper;
