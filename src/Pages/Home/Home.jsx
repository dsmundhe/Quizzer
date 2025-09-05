import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const user = localStorage.getItem("user");
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex flex-col">
      {/* Navbar */}

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6 py-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Master Your Knowledge with{" "}
          <span className="text-indigo-600">Quizzer</span>
        </h2>
        <p className="mt-4 text-base md:text-lg text-gray-600 max-w-xl md:max-w-2xl">
          Challenge yourself with interactive quizzes, track your progress, and
          grow your skills every day. Join thousands of learners and level up
          your knowledge!
        </p>

        {/* Call to Action */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
          {!user ? (
            <>
              {" "}
              <Link
                to="/login"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-sm md:text-base"
              >
                Get Started
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition text-sm md:text-base"
              >
                Create Account
              </Link>
            </>
          ) : (
            <>
              {" "}
              <Link
                to="/landingpage"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-sm md:text-base"
              >
                Explore Quizzes
              </Link>
              <Link
                to="/landingpage"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-sm md:text-base"
              >
                Add Quiz
              </Link>
            </>
          )}
        </div>
      </main>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 text-center">
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition bg-white">
            <h3 className="text-lg md:text-xl font-semibold text-indigo-600 mb-3">
              🎯 Interactive Quizzes
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Test your knowledge with fun, engaging, and timed quizzes.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition bg-white">
            <h3 className="text-lg md:text-xl font-semibold text-indigo-600 mb-3">
              📊 Track Progress
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Keep track of your scores, performance, and improvements.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition bg-white sm:col-span-2 md:col-span-1">
            <h3 className="text-lg md:text-xl font-semibold text-indigo-600 mb-3">
              🚀 Compete & Learn
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Compete with friends and discover new topics to master.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white py-4 md:py-6 text-center text-sm md:text-base">
        <p>© {new Date().getFullYear()} Quizzer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
