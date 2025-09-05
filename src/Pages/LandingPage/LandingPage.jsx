import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/outline";

const LandingPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); // quiz ID to delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "+91 9876543210",
    age: 25,
    address: "123 Main Street, City, Country",
    profilePic: "https://i.pravatar.cc/150?img=12", // placeholder
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://quizzer-backend-phi.vercel.app/quiz/?email=${user.email}`,
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
    await localStorage.removeItem("questions");
    localStorage.setItem("questions", JSON.stringify(quiz.testApis));
    localStorage.setItem("quizTitle", quiz.title || "Quiz");
    localStorage.setItem("quizTopic", quiz.topic || "Topic");
    navigate("/quiz");
  };

  // Trigger delete modal
  const handleDeleteClick = (quizId) => {
    setDeleteId(quizId);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://quizzer-backend-phi.vercel.app/quiz/${deleteId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setQuizzes((prev) => prev.filter((q) => q._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz. Please try again.");
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 sm:gap-0">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 text-center sm:text-left drop-shadow-md">
          Explore Quizzes
        </h1>
        <div className="flex gap-3">
          {user.email !== "dipakmundhe2026@gmail.com" ? (
            <>
              {" "}
              <button
                onClick={() => navigate("/addquiz")}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 shadow-lg transition-transform transform hover:scale-105"
              >
                + Add Quiz
              </button>
            </>
          ) : (
            <></>
          )}
          {user.email === "dipakmundhe2026@gmail.com" ? (
            <>
              {" "}
              <button
                onClick={() => navigate("/addquiz")}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 shadow-lg transition-transform transform hover:scale-105"
              >
                + Add Quiz
              </button>
              <button
                onClick={() => navigate("/quizeprompt")}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-2xl font-semibold hover:from-indigo-500 hover:to-blue-600 shadow-lg transition-transform transform hover:scale-105"
              >
                Quiz Prompt
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="w-full max-w-2xl mb-10">
        <input
          type="text"
          placeholder="Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm text-gray-700 placeholder-gray-400 transition"
        />
      </div>

      {/* Quiz List */}
      {loading ? (
        <p className="text-gray-600 text-lg text-center col-span-full">
          Loading quizzes...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col justify-between border border-gray-200"
              >
                <div>
                  <h2 className="text-xl font-semibold text-indigo-800 mb-2">
                    {quiz.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{quiz.topic}</p>
                </div>
                <div className="flex gap-3 mt-auto">
                  <button
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-2 rounded-2xl font-semibold hover:from-blue-500 hover:to-indigo-600 shadow-md transition-transform transform hover:scale-105"
                    onClick={() => startQuiz(quiz)}
                  >
                    Start Quiz
                  </button>

                  <button
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform transform hover:scale-110 shadow"
                    onClick={() => handleDeleteClick(quiz._id)}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg col-span-full text-center">
              No quizzes found
            </p>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-10 max-w-sm w-full shadow-2xl flex flex-col items-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              Are you sure you want to delete this quiz? This action cannot be
              undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-2xl font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
