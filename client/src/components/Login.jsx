import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      setError(null);
      // redirect to dashboard or test page
    } catch {
      setError("Invalid credentials");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-zinc-800 rounded">
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
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
        Login
      </button>
    </form>
  );
}
