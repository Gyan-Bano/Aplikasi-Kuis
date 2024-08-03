import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import panaSvg from "../assets/pana.svg";
import LoginForm from "./FormLogin";
import CircularProgress from "@mui/material/CircularProgress";

const PageHome = () => {
  const { userLoggedIn, currentUser } = useAuth();
  const [isLoginFormVisible, setLoginFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  const handlePlayNowClick = () => {
    if (!userLoggedIn) {
      setLoginFormVisible(true);
    } else {
      navigate("/quiz-list");
    }
  };

  const handleCloseLoginForm = () => {
    setLoginFormVisible(false);
  };

  const displayName = currentUser?.email.split("@")[0];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-0 bg-white flex items-start justify-center">
      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold font-poppins text-gray-900 mb-4 break-all break-words">
            Hello! {userLoggedIn ? displayName : ""}
          </h1>
          <p className="text-lg font-poppins text-gray-600 mb-6">
            QuizTrivia is the Trivia and quiz playing platform. It brings some
            exciting surprises every day.
          </p>
          <button
            onClick={handlePlayNowClick}
            className="inline-block bg-indigo-600 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            {userLoggedIn ? "Play Now" : "Login to Play Now"}
          </button>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img
            src={panaSvg}
            alt="Quiz Illustration"
            className="w-full h-auto max-w-sm"
          />
        </div>
      </div>
      {isLoginFormVisible && <LoginForm onClose={handleCloseLoginForm} />}
    </div>
  );
};

export default PageHome;
