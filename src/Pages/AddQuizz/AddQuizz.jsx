import React, { useState } from "react";
import axios from "axios";

const AddQuizz = () => {
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    testApis: "",
  });
  const [loading, setLoading] = useState(false); // loading state
  const [success, setSuccess] = useState(""); // success message
  const [error, setError] = useState(""); // error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token"); // get JWT token
      const user = JSON.parse(localStorage.getItem("user")); // parse string to object
      if (!user || !user.email)
        throw new Error("User email not found. Login again.");

      let testApisArray;
      try {
        testApisArray = JSON.parse(formData.testApis); // convert string to array
      } catch (parseError) {
        throw new Error("Test APIs must be a valid JSON array");
      }

      const response = await axios.post(
        "https://quizzer-backend-phi.vercel.app/quiz",
        {
          email: user.email, // now it will be correct
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-lg p-8 border border-blue-200">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
          Add New Quiz
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Title */}
          <div>
            <label className="block text-blue-700 font-medium mb-2">
              Quiz Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter quiz title"
              className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
          </div>

          {/* Quiz Topic */}
          <div>
            <label className="block text-blue-700 font-medium mb-2">
              Quiz Topic
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Enter quiz topic"
              className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
          </div>

          {/* Test APIs */}
          <div>
            <label className="block text-blue-700 font-medium mb-2">
              Test of APIs (as JSON array)
            </label>
            <textarea
              name="testApis"
              value={formData.testApis}
              onChange={handleChange}
              placeholder='Paste API response like [{"question":"Q1","options":["A","B","C","D"],"answer":"A"}, ...]'
              rows="5"
              className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-400 outline-none resize-none transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold shadow-md text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>

          {/* Success/Error Messages */}
          {success && <p className="text-green-600 mt-2">{success}</p>}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddQuizz;
