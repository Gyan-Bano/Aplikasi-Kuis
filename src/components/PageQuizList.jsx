import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import QuizConfirmationDialog from "./DialogQuizConfirmation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/authContext";
import historyIcon from "../assets/history-7614.svg";

const PageQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!userLoggedIn) {
        console.error("User is not authenticated");
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const quizData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(quizData);
        setQuizzes(quizData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [userLoggedIn]);

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setConfirmationOpen(true);
  };

  const handleConfirm = () => {
    setConfirmationOpen(false);
    navigate(`/quiz/${selectedQuiz.id}`, { state: { quiz: selectedQuiz } });
  };

  const handleClose = () => {
    setConfirmationOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-0 bg-white flex flex-col items-center py-8 px-16">
      <div className="flex justify-between items-center w-full mb-4">
        <h1 className="text-4xl font-bold font-poppins text-gray-900 mx-auto">
          Quiz List
        </h1>
        <img
          src={historyIcon}
          alt="History Icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() => navigate("/completed-quizzes")}
        />
      </div>

      <div className="w-full max-w-md mb-8">
        <input
          type="text"
          placeholder="Search for a quiz..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border font-poppins rounded-lg focus:outline-none focus:border-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={quiz.image}
              alt={quiz.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-2">
              {quiz.title}
            </h2>
            <p className="text-gray-600 font-poppins mb-4 text-center flex-grow">
              {quiz.description}
            </p>
            <div className="flex justify-center items-end w-full">
              <button
                onClick={() => handleStartQuiz(quiz)}
                className="bg-indigo-600 text-white font-semibold font-poppins px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
      <QuizConfirmationDialog
        open={confirmationOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        quiz={selectedQuiz}
      />
    </div>
  );
};

export default PageQuizList;