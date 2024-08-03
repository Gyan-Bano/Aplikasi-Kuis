import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import QuizQuestion from "./InterfaceQuizQuestion";
import QuizResult from "./InterfaceQuizResult";
import axios from "axios";
import he from "he";

const PageQuiz = () => {
  const location = useLocation();
  const { quiz } = location.state;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = localStorage.getItem(`quizQuestionIndex_${quiz.id}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem(`quizScore_${quiz.id}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(quiz.apiUrl);
      const decodedQuestions = response.data.results.map((q) => ({
        ...q,
        question: he.decode(q.question),
        correct_answer: he.decode(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map((a) => he.decode(a)),
      }));
      setQuestions(decodedQuestions);
      localStorage.setItem(
        `quizQuestions_${quiz.id}`,
        JSON.stringify(decodedQuestions)
      );
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedQuizData = localStorage.getItem(`quizQuestions_${quiz.id}`);
    if (savedQuizData) {
      const parsedQuizData = JSON.parse(savedQuizData);
      setQuestions(parsedQuizData);
      setLoading(false);
    } else {
      fetchQuestions();
    }
  }, [quiz.apiUrl, quiz.id]);

  useEffect(() => {
    const savedTimer = localStorage.getItem(`quizTimer_${quiz.id}`);
    const savedQuizFinished = localStorage.getItem(`quizFinished_${quiz.id}`);

    if (savedTimer) {
      setTimer(parseInt(savedTimer, 10));
    }

    if (savedQuizFinished === "true") {
      setQuizFinished(true);
    }
  }, [quiz.id]);

  useEffect(() => {
    let intervalId;
    if (timer > 0 && !quizFinished) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          const newTimer = prev - 1;
          localStorage.setItem(`quizTimer_${quiz.id}`, newTimer.toString());
          if (newTimer <= 0) {
            clearInterval(intervalId);
            setQuizFinished(true);
            localStorage.setItem(`quizFinished_${quiz.id}`, "true");
            return 0;
          }
          return newTimer;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timer, quizFinished, quiz.id]);

  useEffect(() => {
    if (quizFinished) {
      localStorage.removeItem(`quizQuestions_${quiz.id}`);
      localStorage.removeItem(`quizTimer_${quiz.id}`);
      localStorage.setItem(`quizFinished_${quiz.id}`, "true");
      const finishedQuizzes = JSON.parse(
        localStorage.getItem("finishedQuizzes") || "[]"
      );
      if (!finishedQuizzes.includes(quiz.id)) {
        finishedQuizzes.push(quiz.id);
        localStorage.setItem(
          "finishedQuizzes",
          JSON.stringify(finishedQuizzes)
        );
      }
    }
  }, [quizFinished, quiz.id]);

  const handleAnswer = (isCorrect) => {
    setAnsweredQuestions((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => {
        const newScore = prev + 1;
        localStorage.setItem(`quizScore_${quiz.id}`, newScore.toString());
        return newScore;
      });
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => {
        const newIndex = prev + 1;
        localStorage.setItem(
          `quizQuestionIndex_${quiz.id}`,
          newIndex.toString()
        );
        return newIndex;
      });
    } else {
      setQuizFinished(true);
      localStorage.setItem(`quizFinished_${quiz.id}`, "true");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
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
        answeredQuestions={answeredQuestions}
        totalQuestions={questions.length}
        category={quiz.title}
      />
    );
  }

  if (questions.length === 0) {
    return <div>No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-page-container">
      <QuizQuestion
        question={currentQuestion}
        handleAnswer={handleAnswer}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        timer={timer}
      />
    </div>
  );
};

export default PageQuiz;
