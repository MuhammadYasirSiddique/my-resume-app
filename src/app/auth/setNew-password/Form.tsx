"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  // useRouter,
  useSearchParams,
} from "next/navigation"; // For handling navigation and search params
// import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { newPasswordSchema } from "@/zod/forgotPasswordSchema";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

export default function SetNewPassword() {
  const [formData, setFormData] = useState<FormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string | null>(null); // State for displaying messages
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<FormData>>({}); // State to store form errors
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false); // For confirm password field

  // const router = useRouter();
  const searchParams = useSearchParams();

  // Extract `userId` and `token` from the URL

  const userid = searchParams.get("userid");
  const token = searchParams.get("token");
  //   console.log("userid: " + userid);
  //   console.log("token: " + token);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null); // Reset message on input change
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // console.log("Form Submission started")

    const { newPassword, confirmPassword } = formData;
    // console.log("Form values:", { newPassword, confirmPassword });

    const zodResult = newPasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });
    console.log(zodResult);

    if (!zodResult.success) {
      const fieldErrors: Partial<FormData> = {};
      zodResult.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof FormData;
        fieldErrors[fieldName] = err.message;
      });
      // console.log("Zod validation status" + fieldErrors);

      setErrors(fieldErrors); // Set error messages
      setLoading(false);
      return;
    }
    // console.log("Zod validation status" + zodResult);
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ newPassword });

      setLoading(false);
      return;
    }

    if (!userid || !token) {
      setMessage("Invalid password reset link");
      setLoading(false);
      return;
    }

    try {
      // Send the new password along with userId and token to the server
      const password = formData.newPassword;
      const response = await fetch("/api/setNewPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, userid, token }),
      });

      if (response.status === 200) {
        setMessage("Password updated successfully");
        // router.push("/signin");
      } else {
        const errorMessage = await response.text();
        console.log("Failed to update password", errorMessage);
        setMessage("Failed to update password");
      }
    } catch (err) {
      setMessage("Error updating password" + err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userid && token) {
      console.log("userid: " + userid);
      console.log("token: " + token);
    }
  }, [userid, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Set New Password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="new-password" className="sr-only">
                New Password
              </label>
              <div className="flex relative items-center mt-1">
                <input
                  id="new-password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  onChange={handleChange}
                  required
                  className={`block w-full px-3 py-2 border ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="New Password"
                  value={formData.newPassword}
                />
                <button
                  type="button"
                  className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowNewPassword(!showNewPassword)} // Toggle visibility
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <span className="">
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">
                  Password must contain:
                  <br />• At least 6 characters
                  <br />• 1 Uppercase
                  <br />• 1 Lowercase
                  <br />• 1 Number
                </p>
              )}
            </span>
            <div className="flex relative items-center mt-1">
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="appearance-none rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
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

          <div>
            <p className="my-2">
              {message && (
                <p
                  className={`text-sm text-center mt-1 ${
                    message.includes("successful")
                      ? "text-green-700"
                      : "text-red-500"
                  }`}
                >
                  {message}
                </p>
              )}
            </p>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Set Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
