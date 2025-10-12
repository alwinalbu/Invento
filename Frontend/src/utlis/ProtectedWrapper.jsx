// import { useContext } from "react";
// import AuthContext from "./AuthContext";
// import { Navigate } from "react-router-dom";

// function ProtectedWrapper({ children }) {
//   const auth = useContext(AuthContext);

//   // Optional loader if user state is being checked
//   if (auth.user === undefined) {
//     return <div>Loading...</div>;
//   }

//   // If not logged in → redirect to login
//   if (!auth.user) {
//     return <Navigate to="/login" replace />;
//   }

//   // If logged in → allow page
//   return children;
// }

// export default ProtectedWrapper;


// src/utils/ProtectedWrapper.js
import { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "./AuthContext";

function ProtectedWrapper({ children }) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  // ✅ Sync with localStorage to prevent stale state
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser && auth.user) {
      auth.signout();
    }
  }, [auth]);

  if (auth.user === undefined) {
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedWrapper;

