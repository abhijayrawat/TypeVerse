import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const { register, login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(username, email, password);
      await login(email, password); // Optional: auto-login after signup
      setError(null);
      navigate("/dashboard");
    } catch {
      setError("Failed to register. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-zinc-800 rounded mt-20">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        className="mb-4 w-full p-2 rounded bg-zinc-700"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="mb-4 w-full p-2 rounded bg-zinc-700"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="mb-4 w-full p-2 rounded bg-zinc-700"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="bg-yellow-400 px-4 py-2 rounded font-bold w-full">
        Sign Up
      </button>
    </form>
  );
}
