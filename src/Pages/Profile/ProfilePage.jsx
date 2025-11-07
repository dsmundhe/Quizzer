import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "+91 9876543210",
    age: 25,
    address: "123 Main Street, City, Country",
    profilePic:
      "https://i.pinimg.com/1200x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-blue-300 p-6 flex items-center justify-center">
      
      {/* Outer Card */}
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-10 animate-fadeUp">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-800 tracking-wide drop-shadow-md">
            My Profile
          </h1>
          <p className="text-gray-600 mt-1">Manage your personal information</p>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">

          {/* Left — Avatar Card */}
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <div className="relative group">
              <img
                src="https://i.pinimg.com/1200x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
                className="w-40 h-40 rounded-full border-[6px] border-blue-300 shadow-2xl object-cover transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-1"
                alt="Profile"
              />
              <div className="absolute inset-0 rounded-full bg-blue-300 blur-2xl opacity-0 group-hover:opacity-20 transition-all"></div>
            </div>

            <h2 className="text-2xl font-bold text-blue-800 mt-5 drop-shadow-sm">
              {user.name}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* Right — Info List */}
          <div className="flex-1 w-full space-y-6 lg:pr-6 animate-slowFade">

            {/* Info Section Title */}
            <h3 className="text-xl font-semibold text-blue-700 border-l-4 border-blue-500 pl-3">
              Personal Details
            </h3>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Item */}
              <div className="p-5 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1">
                <p className="text-blue-700 font-medium">Mobile</p>
                <p className="text-gray-700 mt-1">{user.mobile}</p>
              </div>

              <div className="p-5 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1">
                <p className="text-blue-700 font-medium">Age</p>
                <p className="text-gray-700 mt-1">{user.age}</p>
              </div>

              <div className="sm:col-span-2 p-5 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1">
                <p className="text-blue-700 font-medium">Address</p>
                <p className="text-gray-700 mt-1">{user.address}</p>
              </div>

            </div>

            {/* Logout */}
            <div className="pt-4 text-center lg:text-left">
              <button
                onClick={handleLogout}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(25px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slowFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeUp { animation: fadeUp 0.9s ease-out; }
          .animate-slowFade { animation: slowFade 1.3s ease-out; }
        `}
      </style>
    </div>
  );
};

export default ProfilePage;
