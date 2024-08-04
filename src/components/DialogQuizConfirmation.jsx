// Mengimpor React untuk membuat komponen dialog konfirmasi.
import React from "react";

// Komponen dialog konfirmasi untuk memverifikasi tindakan pengguna sebelum memulai kuis.
const QuizConfirmationDialog = ({ open, onClose, onConfirm, quiz }) => {
  // Mengembalikan null jika dialog tidak terbuka atau data kuis tidak ada.
  if (!open || !quiz) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold font-poppins text-center">
          Confirm Action
        </h2>
        <img
          src={quiz.image}
          alt={quiz.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-2 text-center">
          {quiz.title}
        </h2>
        <p className="text-center text-gray-600 font-poppins">
          {quiz.description}
        </p>
        <p className="text-center text-gray-600 font-poppins mb-4">
          Duration: 10 minutes
        </p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold font-poppins text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 font-semibold font-poppins text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizConfirmationDialog;
