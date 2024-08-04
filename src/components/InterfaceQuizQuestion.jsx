import React, { useState } from "react";

const QuizQuestion = ({
  question,
  handleAnswer,
  currentQuestionIndex,
  totalQuestions,
  timer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Fungsi untuk menangani klik pada opsi jawaban
  const handleOptionClick = (answer) => {
    setSelectedAnswer(answer);
    setTimeout(() => {
      // Memanggil handleAnswer dengan hasil evaluasi apakah jawaban benar
      handleAnswer(answer === question.correct_answer);
      setSelectedAnswer(null);
    }, 1000); // Menunggu 1 detik sebelum melanjutkan
  };

  return (
    <div className="quiz-container px-8 py-32 rounded-lg bg-white max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">{question.category}</h2>
        <p className="text-lg font-semibold">
          Time left: {Math.floor(timer / 60)}:
          {(timer % 60).toString().padStart(2, "0")}
        </p>
      </div>
      <p className="text-xl mb-6">{question.question}</p>
      <p className="mb-4 text-gray-600 text-lg">
        Question {currentQuestionIndex + 1} / {totalQuestions}
      </p>
      <div className="options-container grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {question.incorrect_answers
          .concat(question.correct_answer)
          .sort()
          .map((answer) => (
            <button
              key={answer}
              onClick={() => handleOptionClick(answer)}
              className={`option-button px-6 py-4 text-lg font-semibold font-poppins rounded-lg 
                ${
                  selectedAnswer === answer
                    ? answer === question.correct_answer
                      ? "text-white bg-indigo-600 hover:bg-indigo-700"
                      : "text-white bg-red-600 hover:bg-red-700"
                    : "text-gray-600 bg-gray-200 hover:bg-gray-300"
                }`}
              disabled={selectedAnswer !== null}
            >
              {answer}
            </button>
          ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
