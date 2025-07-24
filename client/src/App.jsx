import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TypingTest from "./components/TypingTest";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-16 min-h-screen bg-zinc-900 text-white">
        <Routes>
          <Route path="/" element={<TypingTest />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* other routes */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
