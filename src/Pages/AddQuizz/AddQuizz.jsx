import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddQuizz = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const GEMINI_API_KEY = "AIzaSyBPhI2LOjmQy819BP8xSplsoo1gFT8bCZY";
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=" +
    GEMINI_API_KEY;

  const generatePrompt = (topic) => `
Generate only a valid JSON array named "questions" with EXACTLY 30 MCQ questions.

Each item format:
{
  "question": "Question?",
  "options": ["A", "B", "C", "D"],
  "answer": "Correct option"
}

✅ STRICT RULES:
- Exactly 30 questions
- Each question must have exactly 4 options
- Answer must match one of the options
- No explanations, no extra text, only the JSON array
- Topic: "${topic}"

Return ONLY the JSON array.
`;

  const extractJsonArray = (text) => {
    try {
      let cleaned = text.replace(/```json|```/g, "").trim();

      const start = cleaned.indexOf("[");
      const end = cleaned.lastIndexOf("]") + 1;

      if (start === -1 || end === -1) {
        throw new Error("No JSON array found in Gemini output");
      }

      const arrayText = cleaned.substring(start, end);
      return JSON.parse(arrayText);
    } catch (err) {
      console.error("❌ JSON Extraction Failed:", err);
      throw new Error("Gemini returned invalid JSON array.");
    }
  };

  const generateQuizFromGemini = async (topic) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: generatePrompt(topic) }] }],
      }),
    });

    const data = await response.json();

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) throw new Error("Invalid response from Gemini");

    const parsedArray = extractJsonArray(raw);

    if (!Array.isArray(parsedArray)) {
      throw new Error("Generated testApis must be an array.");
    }

    return parsedArray;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !user.email) throw new Error("User email missing");

      const generatedQuestions = await generateQuizFromGemini(
        formData.topic.trim()
      );

      await axios.post(
        "https://quizzer-backend-three.vercel.app/quiz",
        {
          email: user.email,
          title: formData.title,
          topic: formData.topic,
          testApis: generatedQuestions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("✅ Quiz added successfully!");
      navigate("/landingpage");

      setFormData({ title: "", topic: "" });
    } catch (err) {
      console.error(err);
      setError(err.message || "❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      {/* ✅ FULL SCREEN LOADER WHEN LOADING */}
      {loading && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/80 backdrop-blur-md z-50">
          {/* Spinner */}
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>

          {/* Text */}
          <h2 className="mt-6 text-2xl font-bold text-blue-700 animate-pulse">
            Generating Your Quiz…
          </h2>

          {/* Shimmer line */}
          <div className="mt-4 w-64 h-3 rounded-full bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 animate-[shimmer_2s_infinite]"></div>

          <style>
            {`
              @keyframes shimmer {
                0% { background-position: -200px 0; }
                100% { background-position: 200px 0; }
              }
            `}
          </style>
        </div>
      )}

      {/* ✅ HIDE FORM WHEN LOADING */}
      {!loading && (
        <div className="bg-white shadow-xl rounded-3xl w-full max-w-lg p-8 border border-blue-200">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
            Add New Quiz
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-blue-700 font-medium mb-2">
                Quiz Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Enter quiz title"
                required
                className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-blue-700 font-medium mb-2">
                Quiz Topic
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, topic: e.target.value }))
                }
                placeholder="Enter quiz topic"
                required
                className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white shadow-md bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300"
            >
              Submit Quiz
            </button>

            {success && (
              <p className="text-green-600 text-center text-lg">{success}</p>
            )}
            {error && (
              <p className="text-red-600 text-center text-lg">{error}</p>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default AddQuizz;
