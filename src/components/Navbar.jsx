import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import questionSquareIcon from "../assets/question-square-svgrepo-com.svg";
import LoginForm from "./FormLogin";
import RegisterForm from "./FormRegister";

const Navbar = () => {
  // Mendefinisikan state untuk status login, tampilan form login, tampilan form registrasi, dan status menu.
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginFormVisible, setLoginFormVisible] = useState(false);
  const [isRegisterFormVisible, setRegisterFormVisible] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  // Menangani klik tombol autentikasi (login/logout).
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
      setMenuOpen(false); // Menutup menu pada tampilan mobile saat membuka form login
    }
  };

// Menangani navigasi dan tampilan form.
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
    setMenuOpen(false);
  };

  const handleQuizListClick = () => {
    navigate("/quiz-list");
    setMenuOpen(false); 
  };

  const handleCompletedQuizzesClick = () => {
    navigate("/completed-quizzes");
    setMenuOpen(false); 
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  // Bagian ini merender tampilan navbar beserta tombol-tombol dan form login/registrasi jika diperlukan.
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
          {userLoggedIn && (
            <>
              <button
                onClick={handleQuizListClick}
                className={`hidden md:inline-block text-lg font-semibold font-poppins px-4 py-2 rounded ${
                  location.pathname === "/quiz-list"
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 focus:bg-indigo-600 focus:text-white"
                }`}
              >
                Quiz List
              </button>
              <button
                onClick={handleCompletedQuizzesClick}
                className={`hidden md:inline-block text-lg font-semibold font-poppins px-4 py-2 rounded ${
                  location.pathname === "/completed-quizzes"
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 focus:bg-indigo-600 focus:text-white"
                }`}
              >
                Completed Quizzes
              </button>
            </>
          )}
        </div>
        <div className="hidden md:block">
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
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-black focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-2">
          {userLoggedIn && (
            <>
              <button
                onClick={handleQuizListClick}
                className={`block w-full text-left text-lg font-semibold font-poppins px-4 py-2 rounded ${
                  location.pathname === "/quiz-list"
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 focus:bg-indigo-600 focus:text-white"
                }`}
              >
                Quiz List
              </button>
              <button
                onClick={handleCompletedQuizzesClick}
                className={`block w-full text-left text-lg font-semibold font-poppins px-4 py-2 rounded mt-2 ${
                  location.pathname === "/completed-quizzes"
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 focus:bg-indigo-600 focus:text-white"
                }`}
              >
                Completed Quizzes
              </button>
            </>
          )}
          <button
            onClick={handleAuthClick}
            className={`block w-full text-left text-lg font-semibold font-poppins px-4 py-2 rounded mt-2 ${
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
      )}
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