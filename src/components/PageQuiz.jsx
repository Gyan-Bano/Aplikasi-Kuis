import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

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
  const navigate = useNavigate();

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
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Finished!</h2>
        <p className="text-lg">Correct Answers: {score}</p>
        <p className="text-lg">Incorrect Answers: {questions.length - score}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg mt-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h2 className="text-2xl font-bold mb-4">{currentQuestion.category}</h2>
      <p className="text-lg mb-4">{currentQuestion.question}</p>
      <div className="options-container">
        {currentQuestion.incorrect_answers
          .concat(currentQuestion.correct_answer)
          .sort()
          .map((answer) => (
            <button
              key={answer}
              onClick={() =>
                handleAnswer(answer === currentQuestion.correct_answer)
              }
              className="option-button"
            >
              {answer}
            </button>
          ))}
      </div>
      <div className="timer-container mt-4">
        <p className="text-lg">
          Time left: {Math.floor(timer / 60)}:
          {(timer % 60).toString().padStart(2, "0")}
        </p>
      </div>
    </div>
  );
};

export default PageQuiz;
