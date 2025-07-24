import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-zinc-900 text-white shadow-md h-16 flex items-center">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-8">
        {/* Brand/Logo */}
        <Link to="/" className="text-2xl font-mono font-bold tracking-widest">
          typeverse
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-8 text-lg font-medium">
          <Link to="/" className="hover:text-yellow-400 transition">
            Test
          </Link>
          <Link to="/dashboard" className="hover:text-yellow-400 transition">
            Dashboard
          </Link>
          <Link to="/leaderboard" className="hover:text-yellow-400 transition">
            Leaderboard
          </Link>
          <Link to="/settings" className="hover:text-yellow-400 transition">
            Settings
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-5">
          {user ? (
            <>
              <span className="font-mono">Hello, {user.username}</span>
              <button
                onClick={logout}
                className="bg-yellow-500 px-4 py-2 rounded font-semibold text-black hover:bg-yellow-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-400 transition">
                Login
              </Link>
              <Link
                to="/signup"
                className="hover:text-yellow-400 transition font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
