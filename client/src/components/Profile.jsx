import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { token, user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  // Fetch user profile on mount
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFormData({ username: res.data.username, email: res.data.email });
        setLoading(false);
      })
      .catch(() => {
        setErr("Failed to fetch profile data");
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Update profile info
  const submitProfile = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        { username: formData.username, email: formData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data); // update global user state
      setMsg("Profile updated successfully");
    } catch {
      setErr("Failed to update profile");
    }
  };

  // Change password
  const submitPassword = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErr("New passwords do not match");
      return;
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/me/password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setMsg("Password changed successfully");
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to change password");
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-zinc-800 rounded text-white">
      <h2 className="text-2xl mb-4">User Profile</h2>
      {msg && <p className="mb-4 text-green-400">{msg}</p>}
      {err && <p className="mb-4 text-red-500">{err}</p>}

      <form onSubmit={submitProfile} className="mb-6">
        <label className="block mb-2">Username</label>
        <input
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-zinc-700"
          required
        />
        <label className="block mb-2">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-zinc-700"
          required
        />
        <button type="submit" className="w-full bg-yellow-400 py-2 rounded font-bold">
          Update Profile
        </button>
      </form>

      <h3 className="text-xl mb-4">Change Password</h3>
      <form onSubmit={submitPassword}>
        <label className="block mb-2">Old Password</label>
        <input
          name="oldPassword"
          type="password"
          value={passwordData.oldPassword}
          onChange={handlePasswordChange}
          className="w-full p-2 mb-4 rounded bg-zinc-700"
          required
        />
        <label className="block mb-2">New Password</label>
        <input
          name="newPassword"
          type="password"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          className="w-full p-2 mb-4 rounded bg-zinc-700"
          required
        />
        <label className="block mb-2">Confirm New Password</label>
        <input
          name="confirmPassword"
          type="password"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
          className="w-full p-2 mb-4 rounded bg-zinc-700"
          required
        />

        <button type="submit" className="w-full bg-yellow-400 py-2 rounded font-bold">
          Change Password
        </button>
      </form>
    </div>
  );
}
