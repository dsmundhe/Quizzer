import React, { useState } from "react";

// Safe parsing from localStorage

const QuizePage = () => {
  const ques = JSON.parse(localStorage.getItem("questions") || "[]");
  const quizTitle = localStorage.getItem("quizTitle") || "Quiz";
  const quizTopic = localStorage.getItem("quizTopic") || "Topic";
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (index, option) => {
    if (!submitted) setAnswers((prev) => ({ ...prev, [index]: option }));
  };

  const handleSubmit = () => {
    const calculatedScore = ques.reduce(
      (acc, q, index) => (answers[index] === q.answer ? acc + 1 : acc),
      0
    );
    setScore(calculatedScore);
    setSubmitted(true);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md">
        <h1 className="text-center text-white text-3xl sm:text-4xl font-bold drop-shadow-lg">
          {quizTitle || "No Title"}
        </h1>
        <p className="text-center text-blue-100 mt-1 sm:text-lg">
          {quizTopic || "No Topic"}
        </p>
      </header>

      {/* Quiz Content */}
      <main className="flex-1 w-full flex justify-center items-start px-4 py-8 overflow-auto">
        <div className="w-full max-w-4xl p-6 sm:p-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-200">
          {ques.length ? (
            <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
              {ques.map((q, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5 rounded-2xl bg-white/60 border border-blue-200 shadow-md hover:shadow-lg transition duration-300"
                >
                  <p className="font-semibold text-blue-800 mb-3 text-sm sm:text-base">
                    {index + 1}. {q.question}
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {q.options.map((option, i) => {
                      let bgColor = "";
                      if (submitted) {
                        if (option === q.answer)
                          bgColor = "bg-green-200 font-semibold";
                        else if (answers[index] === option)
                          bgColor = "bg-red-200 font-semibold";
                        else bgColor = "bg-white";
                      } else {
                        bgColor =
                          answers[index] === option
                            ? "bg-blue-200 font-semibold scale-105 shadow-inner"
                            : "hover:bg-blue-50 hover:scale-105";
                      }

                      return (
                        <label
                          key={i}
                          className={`flex items-center gap-3 p-2 sm:p-3 rounded-xl cursor-pointer transition-all duration-200 transform ${bgColor}`}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={answers[index] === option}
                            onChange={() => handleSelect(index, option)}
                            className="accent-blue-500 w-4 h-4 sm:w-5 sm:h-5"
                            disabled={submitted}
                          />
                          <span className="text-blue-900 text-sm sm:text-base">
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h1 className="text-center text-blue-700 font-semibold">
              No Questions Available!
            </h1>
          )}

          <div className="mt-8 text-center">
            {!submitted && ques.length > 0 && (
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-400 hover:to-blue-400 text-white font-semibold shadow-lg text-base sm:text-lg transition-transform transform hover:scale-105"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 bg-blue-500 text-white text-center text-sm sm:text-base">
        Quiz App &copy; {new Date().getFullYear()}
      </footer>

      {/* Result Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl relative border-4 border-gradient-to-r from-blue-400 to-indigo-500 animate-slideIn">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-white text-3xl font-bold">🎉</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-2 text-center drop-shadow-md">
              Quiz Result
            </h2>

            <p className="text-lg sm:text-xl text-blue-900 mb-6 text-center">
              You scored{" "}
              <span className="font-bold text-green-600">{score}</span> /{" "}
              {ques.length}
            </p>

            <p className="text-md sm:text-lg text-blue-800 mb-6 text-center">
              {score === ques.length
                ? "Perfect! You nailed it! 🎯"
                : score >= ques.length / 2
                ? "Great job! Keep practicing! 👍"
                : "Don't worry! Try again to improve! 💪"}
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-400 hover:to-blue-400 text-white font-semibold shadow-lg transition-transform transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizePage;
