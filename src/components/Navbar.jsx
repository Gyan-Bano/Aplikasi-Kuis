import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import questionSquareIcon from "../assets/question-square-svgrepo-com.svg";
import LoginForm from "./FormLogin";
import RegisterForm from "./FormRegister";

const Navbar = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isLoginFormVisible, setLoginFormVisible] = useState(false);
  const [isRegisterFormVisible, setRegisterFormVisible] = useState(false);

  const handleAuthClick = async () => {
    if (userLoggedIn) {
      try {
        await doSignOut();
        navigate("/");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    } else {
      setLoginFormVisible(true);
      setRegisterFormVisible(false);
    }
  };

  const handleCloseLoginForm = () => {
    setLoginFormVisible(false);
  };

  const handleOpenRegisterForm = () => {
    setLoginFormVisible(false);
    setRegisterFormVisible(true);
  };

  const handleCloseRegisterForm = () => {
    setRegisterFormVisible(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleQuizListClick = () => {
    navigate("/quiz-list");
  };

  return (
    <nav className="bg-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div
            className="flex items-center cursor-pointer"
            onClick={handleLogoClick}
          >
            <img
              src={questionSquareIcon}
              alt="QuizTrivia Icon"
              className="h-8 w-8 mr-2"
            />
            <span className="text-black text-xl font-bold font-poppins">
              QuizTrivia
            </span>
          </div>
          <button
            onClick={handleQuizListClick}
            className={`text-lg font-semibold font-poppins px-4 py-2 rounded ${
              location.pathname === "/quiz-list"
                ? "bg-indigo-600 text-white"
                : "text-indigo-600 border-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 focus:bg-indigo-600 focus:text-white"
            }`}
          >
            Quiz List
          </button>
        </div>
        <div>
          <button
            onClick={handleAuthClick}
            className={`text-lg font-semibold font-poppins px-4 py-2 rounded ${
              userLoggedIn
                ? "text-indigo-600 border-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 focus:bg-indigo-600 focus:text-white"
                : isLoginFormVisible || isRegisterFormVisible
                ? "bg-indigo-600 text-white border-indigo-600"
                : "text-indigo-600 border-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 focus:bg-indigo-600 focus:text-white"
            }`}
          >
            {userLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </div>
      {isLoginFormVisible && (
        <LoginForm
          onClose={handleCloseLoginForm}
          onRegisterClick={handleOpenRegisterForm}
        />
      )}
      {isRegisterFormVisible && (
        <RegisterForm
          onClose={handleCloseRegisterForm}
          onBackToLoginClick={handleAuthClick}
        />
      )}
    </nav>
  );
};

export default Navbar;
