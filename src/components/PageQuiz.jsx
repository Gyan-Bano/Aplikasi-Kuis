import React from "react";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../contexts/authContext";
import QuizQuestion from "./InterfaceQuizQuestion";
import QuizResult from "./InterfaceQuizResult";
import { useQuiz } from "../hooks/useQuiz";

const PageQuiz = () => {
  // Mengambil objek lokasi saat ini dari router
  const location = useLocation();
  // Mengambil data kuis dari state lokasi
  const { quiz } = location.state;
  // Mengambil informasi pengguna dan status login dari context
  const { currentUser, userLoggedIn } = useAuth();

  // Menggunakan custom hook useQuiz untuk mengelola logika kuis
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

  // Jika masih loading, tampilkan indikator loading.
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

  // Menampilkan hasil kuis jika kuis selesai atau timer habis
  if (quizFinished || timer <= 0) {
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
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  // Menampilkan pertanyaan kuis
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
