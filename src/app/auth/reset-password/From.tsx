"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // Importing icons from lucide-react
import { useSession } from "next-auth/react";
import { LoaderCircle } from "lucide-react";
import { resetPasswordSchema } from "@/zod/resetPasswordSchema";

interface FormData {
  oldpassword: string;
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState<FormData>({
    oldpassword: "",
    password: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false); // State to toggle password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false); // For confirm password field
  const [message, setMessage] = useState<string | null>(null); // State for displaying messages
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<FormData>>({}); // State to store form errors

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null); // Reset message on input change
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!session || !session.user || !session.user.email) {
      setMessage("No session or user found.");
      setLoading(false);
      return;
    }

    const { oldpassword, password, confirmPassword } = formData;

    const zodResult = resetPasswordSchema.safeParse({
      oldpassword,
      password,
      confirmPassword,
    });

    if (!zodResult.success) {
      const fieldErrors: Partial<FormData> = {};
      zodResult.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof FormData;
        fieldErrors[fieldName] = err.message;
      });

      setErrors(fieldErrors); // Set error messages
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match");

      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    //  password reset API call
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldpassword, password }),
      });

      if ((await response.status) === 400) {
        setErrors({ oldpassword: "Invalid old password." });
      }
      if (response.ok) {
        setMessage("Password reset successful.");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setMessage("Failed to reset password. Please try again.");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
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
              htmlFor="oldpassword"
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
            {errors.oldpassword && (
              <p className="text-red-500 text-sm mt-1">{errors.oldpassword}</p>
            )}
          </div>

          <span>
            {message && (
              <p
                className={`text-sm mt-1 ${
                  message.includes("successful") ? "" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </span>

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
            <span className="">
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  Password must contain:
                  <br />• At least 6 characters
                  <br />• 1 Uppercase
                  <br />• 1 Lowercase
                  <br />• 1 Number
                </p>
              )}
            </span>
          </div>

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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {message && (
            <p
              className={`text-center mt-2 ${
                message.includes("successful") ? "text-green-500" : ""
              }`}
            >
              {message}
            </p>
          )}

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
