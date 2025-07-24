import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const activeClass = "text-yellow-400 font-bold";
  const inactiveClass = "hover:text-yellow-400 transition";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-zinc-900 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Home Link */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-mono font-bold hover:text-yellow-400 transition">
              TypeVerse
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Always visible */}
            <NavLink 
              to="/"
              className={({ isActive }) => 
                isActive ? activeClass : inactiveClass
              }
            >
              Typing Test
            </NavLink>
            <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  Dashboard
                </NavLink>

            {user && (
              <>
                
                <NavLink
                  to="/leaderboard"
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  Leaderboard
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  Profile
                </NavLink>
              </>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden sm:inline-block text-yellow-400 font-semibold">
                  Hello, {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-yellow-400 text-black px-3 py-1 rounded font-semibold hover:bg-yellow-300 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile menu placeholder for future expansion */}
          {/* Add mobile hamburger menu here if desired */}
        </div>
      </div>
    </nav>
  );
}
