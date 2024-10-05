"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // For handling navigation and search params
import toast from "react-hot-toast";

export default function SetNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract `userId` and `token` from the URL

  const userid = searchParams.get("userid");
  const token = searchParams.get("token");
  //   console.log("userid: " + userid);
  //   console.log("token: " + token);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!userid || !token) {
      setError("Invalid password reset link");
      return;
    }

    try {
      // Send the new password along with userId and token to the server
      const response = await fetch("/api/setNewPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, userid, token }),
      });

      if (response.status === 200) {
        toast.success("Password updated successfully");
        router.push("/signin");
      } else {
        const errorMessage = await response.text();
        console.log("Failed to update password", errorMessage);
        setError("Failed to update password");
      }
    } catch (err) {
      setError("Error updating password" + err);
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
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Set New Password
          </h2>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="new-password" className="sr-only">
                New Password
              </label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                required
                className="appearance-none rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
