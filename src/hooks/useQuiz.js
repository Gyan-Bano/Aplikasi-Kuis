import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";
import he from "he";
import { db } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";

export const useQuiz = (quiz, currentUser) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswersCount, setTotalAnswersCount] = useState(0);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attemptId, setAttemptId] = useState(
    localStorage.getItem("currentAttemptId") || ""
  );

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
    } finally {
      setLoading(false);
    }
  }, [quiz.apiUrl]);

  const initializeAttempt = useCallback(async () => {
    if (!currentUser) return;

    let newAttemptId = attemptId;
    if (!newAttemptId) {
      newAttemptId = uuidv4();
      setAttemptId(newAttemptId);
      localStorage.setItem("currentAttemptId", newAttemptId);
    }

    const quizAttemptRef = doc(
      db,
      "quizAttempts",
      `${currentUser.uid}_${quiz.id}_${newAttemptId}`
    );
    const docSnap = await getDoc(quizAttemptRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(data);
    } else {
      console.log("New attempt created");
    }
  }, [currentUser, quiz.id, attemptId]);

  const saveProgress = useCallback(
    async (currentTimer) => {
      if (!currentUser) return;

      console.log("Saving with Attempt ID:", attemptId); // For debugging

      const progressData = {
        userId: currentUser.uid,
        quizId: quiz.id,
        quizTitle: quiz.title,
        attemptId: attemptId,
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
          `${currentUser.uid}_${quiz.id}_${attemptId}`
        );
        await setDoc(quizAttemptRef, progressData, { merge: true });
        localStorage.setItem(
          `${currentUser.uid}_${quiz.id}_${attemptId}`,
          JSON.stringify(progressData)
        );
      } catch (error) {
        console.error("Error saving quiz progress: ", error);
      }
    },
    [
      currentUser,
      quiz.id,
      quiz.title,
      attemptId,
      questions,
      currentQuestionIndex,
      score,
      totalAnswersCount,
      timer,
      quizFinished,
    ]
  );

  useEffect(() => {
    if (currentUser) {
      initializeAttempt();
    }
  }, [currentUser, initializeAttempt]);

  useEffect(() => {
    const resumeQuiz = async () => {
      if (!currentUser) return;

      const savedProgress = localStorage.getItem(
        `${currentUser.uid}_${quiz.id}_${attemptId}`
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
  }, [currentUser, quiz.id, attemptId, fetchQuestions]);

  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      if (!quizFinished) {
        e.preventDefault();
        await saveProgress(timer);
      }
    };

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        await saveProgress(timer);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [quizFinished, timer, saveProgress]);

  useEffect(() => {
    let intervalId;
    if (timer > 0 && !quizFinished) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          const newTimer = prev - 1;
          if (newTimer <= 0) {
            setQuizFinished(true);
            clearInterval(intervalId);
          }
          saveProgress(newTimer);
          return newTimer;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timer, quizFinished, saveProgress]);

  const handleAnswer = (isCorrect) => {
    setTotalAnswersCount((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      saveProgress(timer);
    } else {
      setQuizFinished(true);
      setTotalAnswersCount(questions.length);
    }
  };

  useEffect(() => {
    if (quizFinished) {
      saveProgress(timer);
    }
  }, [quizFinished, saveProgress, timer]);

  const startNewAttempt = async () => {
    const newAttemptId = uuidv4();
    setAttemptId(newAttemptId);
    localStorage.setItem("currentAttemptId", newAttemptId);

    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimer(600);
    setQuizFinished(false);

    console.log("New Attempt ID:", newAttemptId); // For debugging
    saveProgress();
    fetchQuestions();
  };

  return {
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
  };
};
