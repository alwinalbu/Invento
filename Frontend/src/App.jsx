import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import AuthContext from "./utlis/AuthContext";
import Login from "./pages/Login";
import ProtectedWrapper from "./utlis/ProtectedWrapper";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import PurchaseDetails from "./pages/PurchaseDetails";
import Store from "./pages/Store";
import Sales from "./pages/Sales";

const App = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const myLoginUser = JSON.parse(localStorage.getItem("user"));
    if (myLoginUser) {
      setUser(myLoginUser.id);
    }
    setLoader(false);
  }, []);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback();
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = { user, signin, signout };

  if (loader) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>LOADING...</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            {/* Ensure nested routes use relative paths */}
            <Route index element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchase-details" element={<PurchaseDetails />} />
            <Route path="/manage-store" element={<Store />} />
            <Route path="/sales" element={<Sales />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
