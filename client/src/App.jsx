import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TypingTest from "./components/Home/TypingTest";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Leaderboard from "./components/Leaderboard.jsx";
import Profile from "./components/Profile.jsx";

import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-16 min-h-screen bg-zinc-900 text-white">
        
          <Routes>
          <Route path="/" element={<TypingTest />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
            >
            </Route>
             <Route
    path="/profile"
    element={
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    }
  />
          {/* Add other routes here */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
