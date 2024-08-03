import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import he from "he";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useAuth } from "../contexts/authContext";
import QuizQuestion from "./InterfaceQuizQuestion";
import QuizResult from "./InterfaceQuizResult";

const PageQuiz = () => {
  const location = useLocation();
  const { quiz } = location.state;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswersCount, setTotalAnswersCount] = useState(0);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, userLoggedIn } = useAuth();
  const [attemptNumber, setAttemptNumber] = useState(1);
  const navigate = useNavigate();

  const fetchQuestions = useCallback(async () => {
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
      setError(null);
    } catch (err) {
      setError("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  }, [quiz.apiUrl]);

  const saveProgress = useCallback(
    async (currentTimer) => {
      if (!userLoggedIn) return;

      const progressData = {
        userId: currentUser.uid,
        quizId: quiz.id,
        attemptNumber: attemptNumber,
        questions,
        currentQuestionIndex,
        correctAnswersCount: score,
        incorrectAnswersCount: totalAnswersCount - score,
        totalAnswersCount,
        score,
        timer: currentTimer || timer,
        quizFinished,
        lastUpdated: new Date(),
      };

      try {
        const quizAttemptRef = doc(
          db,
          "quizAttempts",
          `${currentUser.uid}_${quiz.id}_${attemptNumber}`
        );

        await setDoc(quizAttemptRef, progressData, { merge: true });
        localStorage.setItem(
          `${currentUser.uid}_${quiz.id}_${attemptNumber}`,
          JSON.stringify(progressData)
        );
      } catch (error) {
        console.error("Error saving quiz progress: ", error);
      }
    },
    [
      userLoggedIn,
      currentUser,
      quiz.id,
      attemptNumber,
      questions,
      currentQuestionIndex,
      score,
      totalAnswersCount,
      timer,
      quizFinished,
    ]
  );

  const getLastAttemptNumber = useCallback(async () => {
    console.log("=====");
    if (!userLoggedIn) return 1;

    const quizAttemptRef = doc(
      db,
      "quizAttempts",
      `${currentUser.uid}_${quiz.id}_${attemptNumber}`
    );
    console.log(quizAttemptRef);
    const docSnap = await getDoc(quizAttemptRef);
    console.log(docSnap);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.attemptNumber ? data.attemptNumber + 1 : 1;
    } else {
      return 1;
    }
  }, [userLoggedIn, currentUser, quiz.id]);

  useEffect(() => {
    const initializeAttempt = async () => {
      const newAttemptNumber = await getLastAttemptNumber();
      setAttemptNumber(newAttemptNumber);
    };

    if (userLoggedIn) {
      initializeAttempt();
    }
  }, [currentUser, quiz.id, userLoggedIn, getLastAttemptNumber]);

  useEffect(() => {
    const resumeQuiz = async () => {
      if (!userLoggedIn) return;

      const savedProgress = localStorage.getItem(
        `${currentUser.uid}_${quiz.id}_${attemptNumber}`
      );
      if (savedProgress) {
        const data = JSON.parse(savedProgress);
        setQuestions(data.questions);
        setCurrentQuestionIndex(data.currentQuestionIndex);
        setScore(data.correctAnswersCount);
        setTotalAnswersCount(data.totalAnswersCount);
        setTimer(data.timer);
        setQuizFinished(data.quizFinished);
      } else {
        fetchQuestions();
      }

      setLoading(false);
    };

    resumeQuiz();
  }, [currentUser, quiz.id, attemptNumber, userLoggedIn, fetchQuestions]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (!quizFinished) {
        await saveProgress(timer);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [quizFinished, timer, saveProgress]);

  useEffect(() => {
    let intervalId;
    if (timer > 0 && !quizFinished) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          const newTimer = prev - 1;
          saveProgress(newTimer); // Save progress with the updated timer
          return newTimer;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timer, quizFinished]);

  const handleAnswer = (isCorrect) => {
    setTotalAnswersCount((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      saveProgress(timer); // Save after each answer
    } else {
      setQuizFinished(true);
      setTotalAnswersCount(questions.length); // Set totalAnswersCount to the total number of questions
    }
  };

  // useEffect to save progress when quizFinished is set to true
  useEffect(() => {
    if (quizFinished) {
      saveProgress(timer); // Save final state on quiz finish
    }
  }, [quizFinished]);

  const startNewAttempt = async () => {
    console.log("Starting new attempt..."); // Debugging statement
    const newAttemptNumber = await getLastAttemptNumber();
    console.log("--------");
    console.log("New Attempt Number:", newAttemptNumber); // Debugging statement

    setAttemptNumber(newAttemptNumber);

    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimer(600); // reset timer to 10 minutes
    setQuizFinished(false);

    fetchQuestions();
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
