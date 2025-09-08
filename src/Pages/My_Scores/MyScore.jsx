import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const MyScore = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user?.email || !token) {
      setLoading(false);
      return;
    }

    const fetchScores = async () => {
      try {
        const res = await axios.get(
          `https://quizzer-backend-three.vercel.app/score/?email=${user.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data && res.data.data) {
          const sortedScores = res.data.data.sort((a, b) => b.score - a.score);
          setScores(sortedScores);
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
      <p className="text-center text-blue-700 text-lg sm:text-xl animate-pulse font-semibold">
        Loading your scores...
      </p>
    </div>
  );

  if (!scores.length) return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
      <p className="text-center text-blue-700 font-bold text-lg sm:text-xl">
        No quizzes attempted yet 🚀
      </p>
    </div>
  );

  const getColor = (score) => {
    if (score >= 25) return "#16a34a"; // Green
    if (score >= 15) return "#facc15"; // Yellow
    return "#dc2626"; // Red
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-blue-50 to-blue-100 py-6 px-3 sm:px-6 lg:px-10">
      <h1 className="text-xl sm:text-3xl font-extrabold text-center text-blue-800 mb-6">
        📊 My Quiz Scores
      </h1>

      {/* Main Line Chart - Professional */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-blue-200 max-w-4xl mx-auto mb-10">
        <h2 className="text-sm sm:text-lg font-semibold text-blue-800 mb-3 text-center">
          Score Overview (Out of 30)
        </h2>
        <div className="overflow-x-auto">
          <div className="min-w-[500px] sm:min-w-full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={scores}
                margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis
                  dataKey="topic"
                  tick={{ fill: "#1e3a8a", fontSize: 12 }}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={60}
                />
                <YAxis tick={{ fill: "#1e3a8a", fontSize: 12 }} domain={[0, 30]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 6, stroke: "#1e40af", fill: "#3b82f6" }}
                  activeDot={{ r: 8 }}
                  strokeOpacity={1}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Circular Progress Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {scores.map((item) => {
          const percentage = Math.min((item.score / 30) * 100, 100);
          const color = getColor(item.score);

          return (
            <div
              key={item._id}
              onClick={() => setSelectedQuiz(item)}
              className="cursor-pointer bg-white shadow-md hover:shadow-xl rounded-2xl p-4 sm:p-5 border border-blue-200 flex flex-col items-center transition-all duration-300 hover:scale-[1.03] w-full"
            >
              <h2
                className="text-sm sm:text-base font-semibold text-blue-800 mb-2 text-center truncate w-full"
                title={item.topic}
              >
                {item.topic}
              </h2>

              {/* Circular Progress */}
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    stroke={color}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${percentage * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-blue-800 font-bold text-sm sm:text-lg">
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Score: <span style={{ color }}>{item.score}/30</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Modal with Bar Graph */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 relative">
            <button
              onClick={() => setSelectedQuiz(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-lg"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-blue-800 mb-4 text-center">
              {selectedQuiz.topic} - Result
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[{ name: selectedQuiz.topic, score: selectedQuiz.score, max: 30 }]}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="name" tick={{ fill: "#1e3a8a", fontSize: 12 }} />
                <YAxis tick={{ fill: "#1e3a8a", fontSize: 12 }} domain={[0, 30]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                  }}
                />
                <Bar
                  dataKey="score"
                  fill={getColor(selectedQuiz.score)}
                  radius={[10, 10, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>

            <p className="text-center text-gray-600 mt-3 font-semibold">
              Score: <span style={{ color: getColor(selectedQuiz.score) }}>{selectedQuiz.score}/30</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyScore;
