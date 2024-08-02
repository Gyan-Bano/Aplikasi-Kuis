import { db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";

const quizzes = [
  {
    title: "Sports Quiz",
    description: "Challenge your knowledge of sports legends and epic moments.",
    image: "https://firebasestorage.googleapis.com/v0/b/my-quiz-app-7dfdb.appspot.com/o/ai-generated-8766632_1280.jpg?alt=media&token=305ddfeb-7b7b-4a30-b647-41f93c62ad82",
    apiUrl: "https://opentdb.com/api.php?amount=10&category=21",
  },
  {
    title: "Computer Science Quiz",
    description:
      "Dive into the fascinating world of algorithms, coding, and tech history.",
    image: "https://firebasestorage.googleapis.com/v0/b/my-quiz-app-7dfdb.appspot.com/o/computer-1836330_1280.png?alt=media&token=f81b2d1e-5587-4794-ae8c-ecdcd9806968",
    apiUrl: "https://opentdb.com/api.php?amount=10&category=18",
  },
  {
    title: "History Quiz",
    description:
      "Explore the pivotal events and figures that shaped our world.",
    image: "https://firebasestorage.googleapis.com/v0/b/my-quiz-app-7dfdb.appspot.com/o/compass-3408928_1280.jpg?alt=media&token=d883befd-185c-443d-a14f-9913022ab4e5",
    apiUrl: "https://opentdb.com/api.php?amount=10&category=23",
  },
];

const uploadQuizzes = async () => {
  const quizzesCollection = collection(db, "quizzes");
  for (const quiz of quizzes) {
    try {
      await addDoc(quizzesCollection, quiz);
      console.log(`Uploaded quiz: ${quiz.title}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
};

uploadQuizzes();
