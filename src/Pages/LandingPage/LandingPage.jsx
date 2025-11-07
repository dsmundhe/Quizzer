import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/outline";

const LandingPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://quizzer-backend-three.vercel.app/quiz/?email=${user.email}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (quiz) => {
    localStorage.removeItem("questions");
    localStorage.setItem("questions", JSON.stringify(quiz.testApis));
    localStorage.setItem("quizTitle", quiz.title);
    localStorage.setItem("quizTopic", quiz.topic);
    navigate("/quiz");
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://quizzer-backend-three.vercel.app/quiz/${deleteId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setQuizzes((prev) => prev.filter((q) => q._id !== deleteId));

      setDeleteId(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz.");
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 flex flex-col items-center py-10 px-4">

      {/* ---- HEADER ---- */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 drop-shadow-md tracking-tight text-center sm:text-left">
          Explore Quizzes
        </h1>

        {user?.email && (
          <div className="flex gap-4 mt-6 sm:mt-0">
            <button
              onClick={() => navigate("/addquiz")}
              className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              + Add Quiz
            </button>

            <button
              onClick={() => navigate("/score")}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              My Scores
            </button>
          </div>
        )}
      </div>

      {/* ---- SEARCH ---- */}
      <div className="w-full max-w-2xl mb-10">
        <input
          type="text"
          placeholder="Search quizzes by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-6 py-3 rounded-2xl bg-white shadow-md border border-indigo-100 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* ---- QUIZ LIST ---- */}
      {loading ? (
        <p className="text-gray-600 text-lg">Loading quizzes...</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-6 transition-all hover:shadow-2xl hover:scale-[1.03] flex flex-col justify-between"
              >
                {/* Title + Topic */}
                <div>
                  <h2 className="text-xl font-bold text-indigo-800 mb-2">
                    {quiz.title}
                  </h2>
                  <p className="text-gray-600">{quiz.topic}</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => startQuiz(quiz)}
                    className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.04] transition"
                  >
                    Start Quiz
                  </button>

                  <button
                    onClick={() => handleDeleteClick(quiz._id)}
                    className="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 hover:scale-110 transition"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-lg col-span-full text-center">
              No quizzes found
            </p>
          )}
        </div>
      )}

      {/* ---- DELETE MODAL ---- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-fadeIn border border-red-200">
            <h2 className="text-2xl font-bold text-red-600 text-center mb-4">
              Delete Quiz?
            </h2>

            <p className="text-gray-700 text-center mb-6">
              Are you sure you want to delete this quiz?  
              <br />
              <span className="font-semibold">This action cannot be undone.</span>
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-2xl font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Animations ---- */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn .25s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
