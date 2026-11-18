
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/accounts/register/`;

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { confirmPassword, ...registrationData } = formData;

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const responseText = await response.text();

      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        const errorMessage =
          typeof data === "object"
            ? Object.entries(data)
                .map(([field, messages]) =>
                  `${field}: ${
                    Array.isArray(messages)
                      ? messages.join(", ")
                      : messages
                  }`
                )
                .join("\n")
            : "Registration failed.";

        throw new Error(errorMessage || "Registration failed.");
      }

      setSuccess("Account created successfully!");

      alert("Registration successful! Please login.");

      navigate("/login");
    } catch (err) {
      setError(
        err.message || "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-7 sm:p-10">

        <Link
          to="/"
          className="block text-center text-3xl font-extrabold text-blue-600 mb-7"
        >
          ShopEase.
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="text-gray-500 mt-3">
            Join ShopEase and start shopping!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>

              <input
                type="text"
                name="first_name"
                placeholder="First name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>

              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <pre className="whitespace-pre-wrap rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </pre>
          )}

          {success && (
            <p className="text-green-600 text-sm text-center">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="text-center text-gray-600 mt-7">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:text-blue-800"
          >
            Login here
          </Link>
        </p>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-500 text-sm hover:text-blue-600"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
