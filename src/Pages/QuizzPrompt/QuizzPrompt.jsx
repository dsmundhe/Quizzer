import React, { useState } from "react";
import { ClipboardCopy, CheckCircle } from "lucide-react";

const QuizzPrompt = () => {
  const [topic, setTopic] = useState("");
  const [copied, setCopied] = useState(false);

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
5. Questions must be unique, clear, and cover a wide range of topics within "${topic}".
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

Now generate a **questions array of exactly 30 questions** for the topic: "${topic}" following all the rules above.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-10">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 border border-blue-200">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-6">
          Quiz Prompt Generator
        </h1>

        {/* Copy Button at Top */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCopy}
            disabled={!topic}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Topic Input */}
        <div className="mb-6">
          <label className="block text-blue-700 mb-2 font-medium">
            Enter Topic
          </label>
          <input
            type="text"
            placeholder="e.g., Java, React, MongoDB"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-4 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        {/* Prompt Preview */}
        <div className="mb-6">
          <label className="block text-blue-700 mb-2 font-medium">
            Generated Prompt
          </label>
          <textarea
            readOnly
            value={promptText}
            className="w-full h-64 p-4 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 resize-none focus:outline-none shadow-inner"
          />
        </div>
      </div>
    </div>
  );
};

export default QuizzPrompt;
