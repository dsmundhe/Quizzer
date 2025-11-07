import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user")); // ✅ to access name/email
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-100">

      {/* NAVBAR */}
    

      {/* HERO SECTION */}
      <main className="flex flex-1 flex-col-reverse lg:flex-row items-center justify-center gap-10 px-6 py-16 lg:py-24 max-w-7xl mx-auto">

        {/* TEXT */}
        <div className="text-center lg:text-left max-w-xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-tight">
            Master Your Knowledge with{" "}
            <span className="text-indigo-600">Quizzer</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Challenge yourself with interactive quizzes, track your progress,
            and grow your skills every day. Join thousands of learners and level
            up your knowledge effortlessly.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg text-sm md:text-base transition transform hover:scale-105"
                >
                  Get Started
                </Link>

                <Link
                  to="/signup"
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl shadow-md text-sm md:text-base transition transform hover:scale-105"
                >
                  Create Account
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/landingpage"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg text-sm md:text-base transition transform hover:scale-105"
                >
                  Explore Quizzes
                </Link>

                <Link
                  to="/addquiz"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg text-sm md:text-base transition transform hover:scale-105"
                >
                  Add Quiz
                </Link>

                  <Link
                to="/score"
                 className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg text-sm md:text-base transition transform hover:scale-105"
              >
                Performance
              </Link>
              </>
            )}

          </div>
        </div>

        {/* ILLUSTRATION */}
        <div className="w-full max-w-md lg:max-w-lg flex justify-center">
          <img
            src="https://i.pinimg.com/736x/36/02/d1/3602d122eb57e762b0a1177b32c4c04f.jpg"
            alt="Quiz Illustration"
            className="w-72 sm:w-80 lg:w-96 "
          />
        </div>
      </main>

      {/* FEATURES */}
      <section className="py-14 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">

          <div className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-xl transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">
              🎯 Interactive Quizzes
            </h3>
            <p className="text-gray-600">
              Test your knowledge with fun, engaging, and real-time quizzes built just for you.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-xl transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">
              📊 Track Your Progress
            </h3>
            <p className="text-gray-600">
              View detailed performance analytics and grow consistently with each attempt.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-xl transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">
              🚀 Compete & Improve
            </h3>
            <p className="text-gray-600">
              Challenge yourself or compare with friends to stay motivated and keep improving.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-indigo-600 text-white py-5 text-center text-sm md:text-base mt-auto">
        <p>© {new Date().getFullYear()} Quizzer • All Rights Reserved.</p>
      </footer>

    </div>
  );
};

export default Home;
