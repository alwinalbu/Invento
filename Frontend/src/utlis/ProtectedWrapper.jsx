import { useContext } from "react";
import AuthContext from "./AuthContext";
import { Navigate } from "react-router-dom";



function ProtectedWrapper(props) {
  const auth = useContext(AuthContext);
  
  console.log("====================================");
  console.log(auth,"inside protected");
  console.log("====================================");

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return props.children;
}
export default ProtectedWrapper;
