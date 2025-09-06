import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MyScore = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // contains email
    const token = localStorage.getItem("token"); // stored separately

    if (!user?.email || !token) {
      setLoading(false);
      return;
    }

    const fetchScores = async () => {
      try {
        const res = await axios.get(
          `https://quizzer-backend-three.vercel.app/score/?email=${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data && res.data.data) {
          setScores(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <p className="text-center text-blue-700 text-lg sm:text-xl animate-pulse font-semibold">
          Loading your scores...
        </p>
      </div>
    );
  }

  if (!scores.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <p className="text-center text-blue-700 font-bold text-lg sm:text-xl">
          No quizzes attempted yet 🚀
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-blue-50 to-blue-100 py-6 px-3 sm:px-6 lg:px-10">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-800 mb-6">
        📊 My Quiz Scores
      </h1>

      {/* Graph Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-blue-200 max-w-4xl mx-auto mb-10">
        <h2 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 text-center">
          Score Overview
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={scores} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis
              dataKey="topic"
              tick={{ fill: "#1e3a8a", fontSize: 10 }}
              interval={0}
            />
            <YAxis tick={{ fill: "#1e3a8a", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
            <Bar dataKey="score" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Card Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
        {scores.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md hover:shadow-xl rounded-xl p-5 text-center border border-blue-200 transition-all duration-300 hover:scale-[1.03]"
          >
            <h2 className="text-base sm:text-lg font-semibold text-blue-800 mb-2 truncate">
              {item.topic}
            </h2>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                {item.score}
              </p>
              <span className="text-sm sm:text-base text-gray-500">pts</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Your Score</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyScore;
