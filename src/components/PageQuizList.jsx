import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/authContext";
import CircularProgress from "@mui/material/CircularProgress";

const PageQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userLoggedIn } = useAuth();

  const fetchQuizzes = async () => {
    if (!userLoggedIn) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, "quizzes"));
      const quizData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuizzes(quizData);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLoggedIn) {
      fetchQuizzes();
    } else {
      setLoading(false);
    }
  }, [userLoggedIn]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-0 bg-white flex flex-col items-center py-8 px-16">
      <h1 className="text-4xl font-bold font-poppins text-gray-900 mb-4">
        Quiz List
      </h1>
      <div className="w-full max-w-md mb-8">
        <input
          type="text"
          placeholder="Search for a quiz..."
          className="w-full px-4 py-2 border font-poppins rounded-lg focus:outline-none focus:border-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
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
              <button className="bg-indigo-600 text-white font-poppins px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageQuizList;
