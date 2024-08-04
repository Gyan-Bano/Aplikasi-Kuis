import React from "react";
import Navbar from "./components/Navbar";
import LoginForm from "./components/FormLogin";
import RegisterForm from "./components/FormRegister";
import PageHome from "./components/PageHome";
import PageQuizList from "./components/PageQuizList";
import PageQuiz from "./components/PageQuiz";
import PageCompletedQuizzes from "./components/PageCompletedQuizzes"; 
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

// Membuat komponen pembungkus untuk halaman PageQuiz yang menerima state quiz dari lokasi saat ini
const PageQuizWrapper = () => {
  const location = useLocation();
  const quiz = location.state?.quiz;

  return <PageQuiz quiz={quiz} />;
};

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/quiz-list" element={<PageQuizList />} />
          <Route path="/quiz/:id" element={<PageQuizWrapper />} />
          <Route path="/completed-quizzes" element={<PageCompletedQuizzes />} />
          <Route path="/" element={<PageHome />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
