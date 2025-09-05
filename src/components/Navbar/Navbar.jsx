import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = localStorage.getItem("user");
  return (
    <div>
      <nav className="flex justify-between items-center py-4 px-6 md:px-10 bg-white shadow-md">
        <Link to="/">
          {" "}
          <h1 className="text-xl md:text-2xl font-bold text-indigo-600">
            Quizzer
          </h1>
        </Link>
        <div className="space-x-4 md:space-x-6 flex items-center">
          {!user ? (
            <>
              {" "}
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 text-sm md:text-base"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow hover:bg-indigo-700 transition text-sm md:text-base"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {" "}
              <Link
                to="/profile"
                className="bg-indigo-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow hover:bg-indigo-700 transition text-sm md:text-base"
              >
                Profile
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
