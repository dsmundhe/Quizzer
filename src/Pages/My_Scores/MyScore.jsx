import React, { useEffect, useState } from "react";
import axios from "axios";

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
    return <p className="text-center text-gray-600 mt-6">Loading...</p>;
  }

  if (!scores.length) {
    return (
      <p className="text-center text-red-500 font-semibold mt-6">
        No quizzes attempted yet
      </p>
    );
  }

  return (
    <div className="p-6 flex flex-wrap gap-4 justify-center">
      {scores.map((item) => (
        <div
          key={item._id}
          className="bg-white shadow-lg rounded-xl p-6 w-64 text-center border"
        >
          <h2 className="text-lg font-semibold text-gray-800">{item.topic}</h2>
          <p className="text-2xl font-bold text-blue-600 mt-2">{item.score}</p>
        </div>
      ))}
    </div>
  );
};

export default MyScore;
