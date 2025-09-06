import React, { useState } from "react";
import axios from "axios";
import { ClipboardCopy, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddQuizz = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    testApis: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false); // for copy button

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate prompt dynamically based on topic
  const promptText = `
I want you to generate only the "questions" array for a Quiz API in JSON format with the following structure:

[
  {
    "question": "Question text?",
    "options": ["Option1", "Option2", "Option3", "Option4"],
    "answer": "Correct Option"
  }
]

🔹 STRICT RULES FOR THE QUESTIONS ARRAY:
1. The array must contain exactly 30 questions. No more, no less.
2. Each question object must contain:
   a. A non-empty "question" string.
   b. An "options" array with exactly 4 items.
   c. An "answer" string that exactly matches one of the 4 options.
3. Each question must have only one correct answer.
4. All JSON must be valid:
   - No comments.
   - No trailing commas.
   - Proper syntax.
5. Questions must be unique, clear, and cover a wide range of topics within "${formData.topic}".
6. Use simple, precise wording for easy understanding.
7. Include a mix of question types:
   - Definitions
   - Concepts
   - Applications
   - True/False
   - Multiple-choice scenarios
8. Options must be plausible; only one option should be clearly correct.
9. Avoid ambiguity in question phrasing.
10. The output must be **only the "questions" array**, ready to use in an API, with no additional text.

Now generate a **questions array of exactly 30 questions** for the topic: "${formData.topic}" following all the rules above.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.email)
        throw new Error("User email not found. Login again.");

      let testApisArray;
      try {
        testApisArray = JSON.parse(formData.testApis);
      } catch (parseError) {
        throw new Error("Test APIs must be a valid JSON array");
      }

      await axios.post(
        "https://quizzer-backend-three.vercel.app/quiz",
        {
          email: user.email,
          title: formData.title,
          topic: formData.topic,
          testApis: testApisArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("✅ Quiz added successfully!");
      navigate("/landingpage");
      setFormData({ title: "", topic: "", testApis: "" });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.msg || err.message || "❌ Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 sm:px-6 md:px-8 lg:px-10">
  <div className="bg-white shadow-xl rounded-3xl w-full max-w-lg p-6 sm:p-8 md:p-10 border border-blue-200">
    <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center mb-6 sm:mb-8">
      Add New Quiz
    </h2>

    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {/* Quiz Title */}
      <div>
        <label className="block text-blue-700 font-medium mb-1 sm:mb-2">Quiz Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter quiz title"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          required
        />
      </div>

      {/* Quiz Topic */}
      <div>
        <label className="block text-blue-700 font-medium mb-1 sm:mb-2">Quiz Topic</label>
        <input
          type="text"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          placeholder="Enter quiz topic"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          required
        />
      </div>

      {/* Copy Prompt Button */}
      <div className="flex justify-end mb-1 sm:mb-2">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!formData.topic}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copied ? (
            <>
              <CheckCircle className="w-5 h-5" /> Copied!
            </>
          ) : (
            <>
              <ClipboardCopy className="w-5 h-5" /> Copy Prompt
            </>
          )}
        </button>
      </div>

      {/* Test APIs */}
      <div>
        <label className="block text-blue-700 font-medium mb-1 sm:mb-2">
          Test of APIs (as JSON array)
        </label>
        <textarea
          name="testApis"
          value={formData.testApis}
          onChange={handleChange}
          placeholder='Paste API response like [{"question":"Q1","options":["A","B","C","D"],"answer":"A"}, ...]'
          rows="5"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-400 outline-none resize-none transition"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold shadow-md text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300"
        }`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Quiz"}
      </button>

      {/* Success/Error Messages */}
      {success && <p className="text-green-600 mt-2 text-sm sm:text-base">{success}</p>}
      {error && <p className="text-red-600 mt-2 text-sm sm:text-base">{error}</p>}
    </form>
  </div>
</div>

  );
};

export default AddQuizz;
