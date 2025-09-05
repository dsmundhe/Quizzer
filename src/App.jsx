import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Navbar from "./components/Navbar/Navbar";
import LandingPage from "./Pages/LandingPage/LandingPage";
import AddQuizz from "./Pages/AddQuizz/AddQuizz";
import QuizzPrompt from "./Pages/QuizzPrompt/QuizzPrompt";
import QuizePage from "./Pages/QuizPage/QuizePage";
import ProfilePage from "./Pages/Profile/ProfilePage";

// routes

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/addquiz" element={<AddQuizz />} />
          <Route path="/quizeprompt" element={<QuizzPrompt />} />
          <Route path="/quiz" element={<QuizePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
