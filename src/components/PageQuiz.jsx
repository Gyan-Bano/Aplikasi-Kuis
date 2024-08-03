import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import he from "he";

const PageQuiz = () => {
  const location = useLocation();
  const { quiz } = location.state;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    console.log("Fetching questions from API:", quiz.apiUrl);
    try {
      setLoading(true);
      const response = await axios.get(quiz.apiUrl);
      console.log("API Response:", response);
      const decodedQuestions = response.data.results.map((q) => ({
        ...q,
        question: he.decode(q.question),
        correct_answer: he.decode(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map((a) => he.decode(a)),
      }));
      console.log("Decoded Questions:", decodedQuestions);
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
    console.log("useEffect triggered for fetching questions");
    const savedQuizData = localStorage.getItem(`quizQuestions_${quiz.id}`);
    console.log(savedQuizData);
    if (savedQuizData) {
      console.log("Found saved quiz data in localStorage");
      const parsedQuizData = JSON.parse(savedQuizData);
      setQuestions(parsedQuizData);
      console.log(questions);
      setLoading(false);
    } else {
      console.log("No saved quiz data, fetching from API");
      fetchQuestions();
    }
  }, [quiz.apiUrl, quiz.id]);

  useEffect(() => {
    let intervalId;
    if (timer > 0 && !quizFinished) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setQuizFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timer, quizFinished]);

  useEffect(() => {
    if (quizFinished) {
      console.log("Quiz finished, removing quiz data from localStorage");
      localStorage.removeItem(`quizQuestions_${quiz.id}`);
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
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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

  console.log(questions.length);
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
