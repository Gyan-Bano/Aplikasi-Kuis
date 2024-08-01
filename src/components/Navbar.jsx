import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";

const Navbar = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    if (userLoggedIn) {
      try {
        await doSignOut();
        navigate("/login");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="bg-indigo-600 p-4">
      <div className="container mx-auto flex justify-end items-center">
        <div>
          <button
            onClick={handleAuthClick}
            className="text-white text-lg font-semibold hover:text-indigo-200"
          >
            {userLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
