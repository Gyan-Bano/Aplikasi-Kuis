import React from "react";
import { useNavigate } from "react-router-dom";

const QuizResult = ({
  score,
  answeredQuestions,
  totalQuestions,
  category,
  startNewAttempt,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
      <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-xl w-full mx-auto">
        <h2 className="text-4xl font-bold font-poppins mb-4">
          Congratulations
        </h2>
        <p className="text-xl text-gray-700 font-poppins mb-2">
          Category: {category}
        </p>
        <p className="text-lg text-gray-600 font-poppins mb-2">
          You answered
          <span className="text-indigo-600 font-bold font-poppins text-3xl mx-2">
            {score} / {totalQuestions}
          </span>
          questions correctly.
        </p>
        <p className="text-lg text-gray-600 font-poppins mb-6">
          Total questions answered:{" "}
          <span className="font-bold text-indigo-600">{answeredQuestions}</span>
        </p>
        <button
          onClick={() => startNewAttempt()}
          className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg mt-6 hover:bg-indigo-700 transition duration-200"
        >
          Start New Attempt
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg mt-6 hover:bg-indigo-700 transition duration-200"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
