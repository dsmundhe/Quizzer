import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const QuizePage = () => {
  const navigate = useNavigate();
  const ques = JSON.parse(localStorage.getItem("questions") || "[]");
  const quizTitle = localStorage.getItem("quizTitle") || "Quiz";
  const quizTopic = localStorage.getItem("quizTopic") || "Topic";

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [index, setIndex] = useState(0); // TRACK CURRENT QUESTION

  const currentQuestion = ques[index];

  const handleSelect = (option) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [index]: option }));
    }
  };

  const handleNext = () => {
    if (index < ques.length - 1) {
      setIndex(index + 1);
    }
  };

  const handleSubmit = async () => {
    const calculatedScore = ques.reduce(
      (acc, q, idx) => (answers[idx] === q.answer ? acc + 1 : acc),
      0
    );
    setScore(calculatedScore);
    setSubmitted(true);
    setShowModal(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user?.email || !token) {
        toast.error("⚠️ Please login to save your score!");
        return;
      }

      const loadingToast = toast.loading("Saving your score...");

      await axios.post(
        "https://quizzer-backend-three.vercel.app/score",
        {
          topic: quizTopic,
          email: user.email,
          score: calculatedScore,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Score saved successfully!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to save score!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-indigo-50 flex flex-col">

      {/* Header */}
      <header className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md">
        <h1 className="text-center text-white text-3xl sm:text-4xl font-bold drop-shadow-lg">
          {quizTitle}
        </h1>
        <p className="text-center text-blue-100 mt-1 sm:text-lg">{quizTopic}</p>
      </header>

      {/* BODY */}
      <main className="flex-1 w-full flex justify-center items-start px-4 py-8">
        <div className="w-full max-w-3xl p-6 sm:p-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-200">

          {/* PROGRESS BAR */}
          <div className="mb-6">
            <div className="flex justify-between text-sm font-semibold text-blue-800 mb-2">
              <span>Question {index + 1} / {ques.length}</span>
              <span>{Object.keys(answers).length} Attempted</span>
            </div>
            <div className="w-full bg-blue-100 h-2 rounded-full">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                style={{ width: `${((index + 1) / ques.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* SINGLE QUESTION */}
          {currentQuestion && (
            <div className="p-5 rounded-2xl bg-white/70 border border-blue-200 shadow-md transition">
              <p className="font-semibold text-blue-800 mb-4 text-lg">
                {index + 1}. {currentQuestion.question}
              </p>

              <div className="grid gap-4">
                {currentQuestion.options.map((option, i) => {
                  const isSelected = answers[index] === option;

                  return (
                    <label
                      key={i}
                      onClick={() => handleSelect(option)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all 
                        ${isSelected ? "bg-blue-200 border-blue-500 shadow-inner" : "bg-white border-gray-200 hover:bg-blue-50"}
                      `}
                    >
                      <input
                        type="radio"
                        checked={isSelected}
                        className="accent-blue-600 w-5 h-5"
                        readOnly
                      />
                      <span className="text-blue-900">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* NAV BUTTONS */}
          <div className="mt-8 flex justify-between">
            {/* PREV BUTTON */}
            {index > 0 && (
              <button
                onClick={() => setIndex(index - 1)}
                className="px-6 py-3 bg-gray-300 text-gray-900 rounded-xl font-semibold hover:bg-gray-400 transition"
              >
                Previous
              </button>
            )}

            {/* NEXT OR SUBMIT */}
            {index === ques.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 bg-blue-500 text-white text-center">
        Quiz App © {new Date().getFullYear()}
      </footer>

      {/* Result Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl border-4 border-blue-300 animate-slideUp">
            <h2 className="text-3xl font-bold text-blue-700 text-center mb-4">
              Quiz Result
            </h2>

            <p className="text-xl text-blue-900 text-center mb-4">
              You scored <span className="font-bold text-green-600">{score}</span> / {ques.length}
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:scale-105 transition mb-4"
            >
              Close
            </button>

            <button
              onClick={() => navigate("/score")}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-md hover:scale-105 transition"
            >
              View Scoreboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizePage;
