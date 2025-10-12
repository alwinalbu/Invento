import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import PurchaseDetails from "./pages/PurchaseDetails";
import Store from "./pages/Store";
import Sales from "./pages/Sales";
import Layout from "./components/Layout";
import ProtectedWrapper from "./utlis/ProtectedWrapper";
import AuthContext from "./utlis/AuthContext";
import Suppliers from "./pages/Suppliers";

const App = () => {
  const [user, setUser] = useState(undefined); 
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        setUser(savedUser.id); 
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      setUser(null);
    } finally {
      setLoader(false);
    }
  }, []);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback && callback();
  };

const signout = (callback) => {
  localStorage.removeItem("user");
  setUser(null);
  callback && callback();
};

  const value = { user, signin, signout };

  if (loader || user === undefined) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.5rem",
        }}
      >
        LOADING...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          {/* Redirect logged-in users away from auth pages */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <Register />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="purchase-details" element={<PurchaseDetails />} />
            <Route path="manage-store" element={<Store />} />
            <Route path="sales" element={<Sales />} />
            <Route path="suppliers" element={<Suppliers />} />
          </Route>

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;

