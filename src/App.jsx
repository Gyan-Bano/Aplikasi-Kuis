import React from "react";
import Navbar from "./components/Navbar";
import LoginForm from "./components/FormLogin";
import RegisterForm from "./components/FormRegister";
import PageHome from "./components/PageHome";
import PrivateRoute from "./hoc/PrivateRoute";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PageHome />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
