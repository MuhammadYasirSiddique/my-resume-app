"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // Importing icons from lucide-react
import { useSession } from "next-auth/react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    oldpassword: "",
    password: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false); // State to toggle password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false); // For confirm password field
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!session || !session.user || !session.user.email) {
      toast.error("Unauthorized");
      return;
    }

    const { oldpassword, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    // Simulate password reset API call
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldpassword, password }),
      });

      if (response.status === 400) {
        toast.error("Invalid old password");
        return;
      }
      if (response.ok) {
        toast.success("Password reset successful");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again." + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Old password
            </label>
            <div className="flex items-center mt-1">
              <input
                type={showOldPassword ? "text" : "password"} // Toggle between text and password
                name="oldpassword"
                id="oldpassword"
                required
                placeholder="Enter your old password"
                value={formData.oldpassword}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowOldPassword(!showOldPassword)} // Toggle visibility
              >
                {showOldPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {/* Password Field with Toggle */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="flex items-center mt-1">
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password
                name="password"
                id="password"
                required
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field with Toggle */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="flex items-center mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
                name="confirmPassword"
                id="confirmPassword"
                required
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility for confirm password
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full h-10 px-4 py-2 text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 transition duration-300 ${
              loading ? "bg-indigo-400 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
