
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api/accounts/profile/";

const emptyProfile = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
};

function Profile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [originalProfile, setOriginalProfile] = useState(emptyProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-500 transition";

  // Fetch profile from Django
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setMessage("Please login to view your profile.");
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Unable to load profile."
          );
        }

        const user = {
          username: data.username || "",
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
        };

        setProfile(user);
        setOriginalProfile(user);
      } catch (err) {
        setMessage(err.message || "Unable to connect to backend.");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Enable editing
  const handleEdit = (e) => {
    e.preventDefault();

    setProfile({ ...originalProfile });
    setMessage("");
    setError(false);
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancel = (e) => {
    e.preventDefault();

    setProfile({ ...originalProfile });
    setIsEditing(false);
    setMessage("");
    setError(false);
  };

  // Save profile to Django
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing || saving) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage("Your session has expired. Please login again.");
      setError(true);
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError(false);

      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        const details = Object.entries(data)
          .map(([field, value]) => {
            const text = Array.isArray(value)
              ? value.join(", ")
              : typeof value === "string"
                ? value
                : JSON.stringify(value);

            return `${field}: ${text}`;
          })
          .join("\n");

        throw new Error(details || "Profile update failed.");
      }

      const updatedProfile = {
        username: data.username ?? profile.username,
        email: data.email ?? profile.email,
        first_name: data.first_name ?? profile.first_name,
        last_name: data.last_name ?? profile.last_name,
      };

      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.message || "Unable to update profile.");
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  const fullName =
    `${profile.first_name} ${profile.last_name}`.trim();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <Link
            to="/"
            className="text-2xl font-extrabold text-blue-600"
          >
            ShopEase.
          </Link>

          <Link
            to="/"
            className="text-blue-600 font-semibold hover:text-blue-800"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            My Account
          </h1>

          <p className="text-gray-500 mt-3">
            Manage your personal information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10">

          {/* Avatar */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold shadow-md">
              {(fullName || profile.username || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              {fullName || profile.username || "Your Name"}
            </h2>

            <p className="text-gray-500 mt-1">
              {profile.email}
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div
              className={`p-4 rounded-xl text-center text-sm font-medium mb-6 whitespace-pre-wrap ${
                error
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                disabled={!isEditing || saving}
                required
                className={inputClass}
              />
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>

              <input
                type="text"
                name="first_name"
                value={profile.first_name}
                onChange={handleChange}
                disabled={!isEditing || saving}
                className={inputClass}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>

              <input
                type="text"
                name="last_name"
                value={profile.last_name}
                onChange={handleChange}
                disabled={!isEditing || saving}
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing || saving}
                required
                className={inputClass}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-3">

              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              )}

            </div>
          </form>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7">
          <Link
            to="/orders"
            className="bg-white p-5 rounded-2xl shadow-sm text-center font-semibold text-blue-600 hover:bg-blue-50"
          >
            📦 My Orders
          </Link>

          <Link
            to="/wishlist"
            className="bg-white p-5 rounded-2xl shadow-sm text-center font-semibold text-blue-600 hover:bg-blue-50"
          >
            ♡ My Wishlist
          </Link>

          <Link
            to="/cart"
            className="bg-white p-5 rounded-2xl shadow-sm text-center font-semibold text-blue-600 hover:bg-blue-50"
          >
            🛒 My Cart
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Profile;
