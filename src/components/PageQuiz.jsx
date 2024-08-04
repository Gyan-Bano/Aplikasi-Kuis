import React from "react";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../contexts/authContext";
import QuizQuestion from "./InterfaceQuizQuestion";
import QuizResult from "./InterfaceQuizResult";
import { useQuiz } from "../hooks/useQuiz";

const PageQuiz = () => {
  const location = useLocation();
  const { quiz } = location.state;
  const { currentUser, userLoggedIn } = useAuth();

  const {
    questions,
    currentQuestionIndex,
    score,
    totalAnswersCount,
    timer,
    quizFinished,
    loading,
    error,
    handleAnswer,
    startNewAttempt,
  } = useQuiz(quiz, userLoggedIn ? currentUser : null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (quizFinished) {
    return (
      <QuizResult
        score={score}
        answeredQuestions={totalAnswersCount}
        totalQuestions={questions.length}
        category={quiz.category}
        startNewAttempt={startNewAttempt}
      />
    );
  }

  if (questions.length === 0) {
    return <div>No questions available.</div>;
  }

  return (
    <QuizQuestion
      question={questions[currentQuestionIndex]}
      handleAnswer={handleAnswer}
      currentQuestionIndex={currentQuestionIndex}
      totalQuestions={questions.length}
      timer={timer}
    />
  );
};

export default PageQuiz;
