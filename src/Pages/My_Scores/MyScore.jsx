import React, { useEffect, useMemo, useState } from "react";
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
  const [selectedTopic, setSelectedTopic] = useState(null);

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

        if (res.data?.data) {
          const sorted = res.data.data
            .map((s) => ({
              ...s,
              createdAt:
                s.createdAt ||
                s.created_at ||
                s.date ||
                s.attemptedAt ||
                new Date().toISOString(),
            }))
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );

          setScores(sorted);
        }
      } catch (err) {
        console.error("Error fetching scores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const getColor = (score) => {
    if (score >= 25) return "#16a34a";
    if (score >= 15) return "#f59e0b";
    return "#dc2626";
  };

  const overall = useMemo(() => {
    if (!scores.length) return null;

    const total = scores.length;
    const sum = scores.reduce((a, b) => a + Number(b.score), 0);
    const avg = sum / total;
    const max = Math.max(...scores.map((s) => Number(s.score)));
    const min = Math.min(...scores.map((s) => Number(s.score)));
    const accuracy = (avg / 30) * 100;

    const trend = scores.slice(-20).map((s, i) => ({
      index: i + 1,
      score: Number(s.score),
      topic: s.topic,
      date: new Date(s.createdAt).toLocaleString(),
    }));

    return {
      total,
      avg: Number(avg.toFixed(2)),
      max,
      min,
      accuracy: Number(accuracy.toFixed(1)),
      trend,
    };
  }, [scores]);

  const topics = useMemo(() => {
    const grouped = {};

    scores.forEach((s) => {
      const topic = s.topic || "Untitled";
      if (!grouped[topic]) grouped[topic] = [];
      grouped[topic].push(s);
    });

    return Object.entries(grouped).map(([topic, attempts]) => {
      const count = attempts.length;
      const best = Math.max(...attempts.map((a) => Number(a.score)));
      const avg = attempts.reduce((a, c) => a + Number(c.score), 0) / count;
      const last = attempts[attempts.length - 1];

      return {
        topic,
        attempts: attempts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        ),
        avg: Number(avg.toFixed(2)),
        best,
        lastDate: last?.createdAt
          ? new Date(last.createdAt).toLocaleString()
          : "Unknown",
        count,
      };
    });
  }, [scores]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
        <p className="animate-pulse text-lg font-semibold text-blue-700">
          Loading analytics...
        </p>
      </div>
    );

  if (!scores.length)
    return (
      <div className="h-screen flex items-center justify-center bg-blue-50">
        <p className="text-blue-700 text-xl font-semibold">
          No quiz data available.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 px-3 sm:px-6 md:px-10 py-6">

      {/* HEADER */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900 mb-6 text-center md:text-left">
        Performance Dashboard
      </h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-10">
        {/* Total Attempts */}
        <div className="bg-white p-4 rounded-2xl border shadow text-center sm:text-left">
          <p className="text-gray-500 text-xs sm:text-sm">Total Attempts</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-800">
            {overall.total}
          </p>
        </div>

        {/* Average */}
        <div className="bg-white p-4 rounded-2xl border shadow text-center sm:text-left">
          <p className="text-gray-500 text-xs sm:text-sm">Average Score</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-800">
            {overall.avg}
          </p>
          <p className="text-xs text-gray-600">{overall.accuracy}% accuracy</p>
        </div>

        {/* Best */}
        <div className="bg-white p-4 rounded-2xl border shadow text-center sm:text-left">
          <p className="text-gray-500 text-xs sm:text-sm">Highest Score</p>
          <p
            className="text-xl sm:text-2xl font-bold"
            style={{ color: getColor(overall.max) }}
          >
            {overall.max}
          </p>
        </div>

        {/* Lowest */}
        <div className="bg-white p-4 rounded-2xl border shadow text-center sm:text-left">
          <p className="text-gray-500 text-xs sm:text-sm">Lowest Score</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-800">
            {overall.min}
          </p>
        </div>

        {/* Topics */}
        <div className="bg-white p-4 rounded-2xl border shadow text-center sm:text-left">
          <p className="text-gray-500 text-xs sm:text-sm">Topics Covered</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-800">
            {topics.length}
          </p>
        </div>
      </div>

      {/* TREND + TOPIC SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-3">
            Recent Trend
          </h2>

          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overall.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Snapshot */}
        <div className="bg-white rounded-2xl border shadow p-4 sm:p-6 max-h-[400px] overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-3">
            Topic Snapshot
          </h2>

          <div className="space-y-3">
            {topics.map((t, i) => (
              <div
                key={i}
                className="p-3 border rounded-xl hover:shadow cursor-pointer flex items-center justify-between"
                onClick={() => setSelectedTopic(t)}
              >
                <div className="flex-1">
                  <p className="font-semibold text-blue-800 text-sm truncate">
                    {t.topic}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.count} attempts • Best {t.best}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className="font-bold text-sm"
                    style={{ color: getColor(t.best) }}
                  >
                    {t.avg}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round((t.avg / 30) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* TOPIC CARDS GRID */}
      <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 text-center md:text-left">
        Topics Overview
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {topics.map((t) => {
          const percent = Math.round((t.best / 30) * 100);

          return (
            <div
              key={t.topic}
              onClick={() => setSelectedTopic(t)}
              className="bg-white rounded-2xl border shadow hover:shadow-xl transition p-4 cursor-pointer"
            >
              <p className="text-sm text-gray-500">Topic</p>
              <p className="font-bold text-blue-800 text-base sm:text-lg truncate">
                {t.topic}
              </p>
              <p className="text-xs text-gray-500">Attempts: {t.count}</p>

              <div className="mt-3">
                <div className="w-full h-2 bg-blue-50 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${percent}%`,
                      background:
                        "linear-gradient(90deg, #2563eb, #7c3aed)",
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  Best: {t.best} ({percent}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 z-[999] overflow-y-auto">

          <div className="bg-white rounded-3xl shadow-xl max-w-3xl w-full p-5 relative">
            <button
              onClick={() => setSelectedTopic(null)}
              className="absolute top-4 right-4 text-xl text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-3">
              {selectedTopic.topic}
            </h2>

            <div className="text-sm text-gray-500 mb-4">
              {selectedTopic.count} attempts • Last: {selectedTopic.lastDate}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Chart */}
              <div className="bg-white border rounded-xl p-4 h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={selectedTopic.attempts.map((a, i) => ({
                      index: i + 1,
                      score: Number(a.score),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="index" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Attempts List */}
              <div className="bg-white border rounded-xl p-4 max-h-64 sm:max-h-72 overflow-y-auto">
                <h3 className="text-sm font-semibold mb-3">Attempts</h3>
                {selectedTopic.attempts.map((a, i) => (
                  <div
                    key={i}
                    className="p-3 border rounded-lg mb-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        {a.score} / 30
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(a.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-5 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MyScore;
