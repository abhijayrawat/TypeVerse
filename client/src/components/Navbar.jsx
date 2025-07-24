import { Link } from "react-router-dom";

export default function Navbar() {
  const user = null; // or user object when logged in

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-zinc-900 text-white shadow-md h-16 flex items-center">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-8">
        <Link to="/" className="text-2xl font-mono font-bold tracking-widest">
          typeverse
        </Link>

        <div className="flex gap-8 text-lg font-medium">
          <Link to="/test" className="hover:text-yellow-400 transition">Test</Link>
          <Link to="/dashboard" className="hover:text-yellow-400 transition">Dashboard</Link>
          <Link to="/leaderboard" className="hover:text-yellow-400 transition">Leaderboard</Link>
          <Link to="/settings" className="hover:text-yellow-400 transition">Settings</Link>
        </div>

        <div className="flex items-center gap-5">
          {/* <ThemeToggle /> Uncomment when ready */}
          {user ? (
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-mono">{user.username}</span>
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-400 transition">Login</Link>
              <Link to="/signup" className="hover:text-yellow-400 transition font-semibold">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
