import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]); // re-run whenever the route changes

  return (
    <nav className="w-full py-4 md:py-5 px-6 bg-white/80 backdrop-blur-md shadow-sm flex justify-between items-center sticky top-0 z-50 border-b border-gray-200">
      <Link to="/">
        {" "}
        <h1 className="text-xl md:text-2xl font-extrabold text-indigo-600 tracking-wide">
          Quizzer
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {/* ✅ If user NOT logged in */}
        {!user ? (
          <>
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:text-indigo-700 transition text-sm md:text-base"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-sm md:text-base"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {/* ✅ Dashboard Button */}

            <Link
              to="/landingpage"
              className="hidden sm:block px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-sm md:text-base"
            >
              Dashboard
            </Link>

            {/* ✅ Profile Avatar */}
            <Link
              to="/profile"
              className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition font-semibold text-sm cursor-pointer"
              title="Profile"
            >
              {userInitial}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
