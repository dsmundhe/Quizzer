// Updated AddQuizz Component with two options: (1) Generate via Gemini, (2) Add API manually
// Also includes "Copy Prompt" button to copy Gemini prompt based on topic.

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddQuizz = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", topic: "", apiData: "" });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [useManualAPI, setUseManualAPI] = useState(false);

  const GEMINI_API_KEY = "AIzaSyBPhI2LOjmQy819BP8xSplsoo1gFT8bCZY";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

  const generatePrompt = (topic) => `
Generate only a valid JSON array with EXACTLY 30 MCQ questions.

Each item format:
{
  "question": "Question?",
  "options": ["A", "B", "C", "D"],
  "answer": "Correct option"
}

STRICT RULES:
- Exactly 30 questions
- Each question must have exactly 4 options
- Answer must match one of the options
- No explanations, no extra text, only the JSON array
- Topic: "${topic}"

Return ONLY the JSON array.
`;

  const copyPrompt = () => {
    const prompt = generatePrompt(formData.topic);
    navigator.clipboard.writeText(prompt);
    alert("Prompt copied!");
  };

  const extractJsonArray = (text) => {
    try {
      let cleaned = text.replace(/```json|```/g, "").trim();
      const start = cleaned.indexOf("[");
      const end = cleaned.lastIndexOf("]") + 1;
      if (start === -1 || end === -1) throw new Error("No JSON array found");
      return JSON.parse(cleaned.substring(start, end));
    } catch (err) {
      throw new Error("Gemini returned invalid JSON array.");
    }
  };

  const generateQuizFromGemini = async (topic) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: generatePrompt(topic) }] }] }),
    });

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("Invalid response from Gemini");

    const parsedArray = extractJsonArray(raw);
    if (!Array.isArray(parsedArray)) throw new Error("Output must be array");

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
      if (!user?.email) throw new Error("User email missing");

      let finalQuestions;

      if (useManualAPI) {
        finalQuestions = JSON.parse(formData.apiData);
        if (!Array.isArray(finalQuestions)) throw new Error("Manual API must be an array");
      } else {
        finalQuestions = await generateQuizFromGemini(formData.topic.trim());
      }

      await axios.post(
        "https://quizzer-backend-three.vercel.app/quiz",
        {
          email: user.email,
          title: formData.title,
          topic: formData.topic,
          testApis: finalQuestions,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Quiz added successfully!");
      navigate("/landingpage");
      setFormData({ title: "", topic: "", apiData: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      {loading && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/80 backdrop-blur-md z-50">
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="mt-6 text-2xl font-bold text-blue-700 animate-pulse">Generating Your Quiz…</h2>
          <div className="mt-4 w-64 h-3 rounded-full bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 animate-[shimmer_2s_infinite]"></div>
        </div>
      )}

      {!loading && (
        <div className="bg-white shadow-xl rounded-3xl w-full max-w-lg p-8 border border-blue-200">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">Add New Quiz</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-blue-700 font-medium mb-2">Quiz Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900"
              />
            </div>

            <div>
              <label className="block text-blue-700 font-medium mb-2">Quiz Topic</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
                className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900"
              />
            </div>

            {/* Copy Prompt Button */}
            <button
              type="button"
              onClick={copyPrompt}
              className="w-full py-2 rounded-xl text-blue-700 border border-blue-400 hover:bg-blue-50"
            >
              Copy Prompt for Topic
            </button>

            {/* Toggle between Gemini / Manual */}
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl">
              <span className="text-blue-700 font-medium">Use Manual API Input</span>
              <input
                type="checkbox"
                checked={useManualAPI}
                onChange={() => setUseManualAPI(!useManualAPI)}
                className="w-5 h-5"
              />
            </div>

            {/* Manual API Input */}
            {useManualAPI && (
              <textarea
                rows="6"
                placeholder="Paste your JSON array here"
                value={formData.apiData}
                onChange={(e) => setFormData({ ...formData, apiData: e.target.value })}
                className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-blue-50 text-blue-900"
              ></textarea>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white shadow-md bg-gradient-to-r from-blue-500 to-blue-400"
            >
              Submit Quiz
            </button>

            {success && <p className="text-green-600 text-center text-lg">{success}</p>}
            {error && <p className="text-red-600 text-center text-lg">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default AddQuizz;
