// Mengimpor React, hooks, dan modul tambahan yang diperlukan untuk komponen.
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/authContext";

// Menyimpan state untuk kuis yang telah selesai, loading, dan query pencarian.
const PageCompletedQuizzes = () => {
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser, userLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Mengambil data kuis yang telah selesai dari Firestore jika pengguna terautentikasi.
  useEffect(() => {
    const fetchCompletedQuizzes = async () => {
      if (!userLoggedIn || !currentUser.uid) {
        console.error("User is not authenticated or UID is not available");
        setLoading(false);
        return;
      }

      try {
        const quizzesRef = collection(db, "quizAttempts");
        const q = query(
          quizzesRef,
          where("quizFinished", "==", true),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const quizData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(quizData);
        setCompletedQuizzes(quizData);
      } catch (error) {
        console.error("Error fetching completed quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedQuizzes();
  }, [currentUser, userLoggedIn]);

  // Menangani perubahan nilai input pencarian.
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Menyaring daftar kuis yang telah selesai berdasarkan query pencarian.
  const filteredQuizzes = completedQuizzes.filter((quiz) =>
    quiz.quizTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Jika masih loading, tampilkan indikator loading.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-0 bg-white flex flex-col items-center py-8 px-4 md:px-16">
      <div className="flex justify-between items-center w-full mb-4">
        <h1 className="text-4xl font-bold font-poppins text-gray-900 mx-auto">
          Completed Quizzes
        </h1>
      </div>

      <div className="w-full max-w-md mb-8">
        <input
          type="text"
          placeholder="Search for a quiz..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border font-poppins rounded-lg focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="w-full space-y-4 py-4">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white text-gray-900 shadow-md rounded-lg p-4 flex flex-col items-center md:flex-row md:justify-between"
            >
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div>
                  <h2 className="text-xl font-bold font-poppins">
                    {quiz.quizTitle}
                  </h2>
                  <p className="text-sm">
                    {new Date(quiz.lastUpdated.toDate()).toLocaleString()}
                  </p>
                  <p className="text-sm">Quiz Completed</p>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end space-y-2">
                <p className="text-gray-600 font-poppins">
                  Total Questions Answered: {quiz.totalAnswersCount}
                </p>
                <p className="text-gray-600 font-poppins">
                  Score: {quiz.score} / {quiz.totalAnswersCount}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 font-poppins text-center">
            There are no completed quizzes yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default PageCompletedQuizzes;
