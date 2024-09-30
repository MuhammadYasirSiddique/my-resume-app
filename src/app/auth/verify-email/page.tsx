"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation"; // Import useSearchParams

const VerifyEmail = () => {
  const [token, setToken] = useState<string>("");
  const [message, setMessage] = useState("");
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);
  const searchParams = useSearchParams(); // Get query parameters
  const email = searchParams.get("email"); // Retrieve the email from the query params
  console.log(email);
  // Simulate a "database" token for verification purposes
  const dbtoken = 123456;

  // Effect hook to verify the token whenever submittedToken changes
  useEffect(() => {
    if (submittedToken) {
      setMessage("Verifying your email...");

      try {
        const data = Number(submittedToken);
        console.log("Submitted Token:", data);

        if (data === dbtoken) {
          setMessage("Email verified successfully!");
        } else {
          setMessage("Email verification failed. Please check your token.");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setMessage("An error occurred during verification.");
      }
    }
  }, [submittedToken]); // Re-run the effect when submittedToken changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      setSubmittedToken(token); // Set the submitted token to trigger useEffect
      setToken(""); // Clear the input field after submission to simulate a refresh
    } else {
      setMessage("Please enter a valid token.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Email Verification</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="token" className="block text-gray-700 mb-2">
            We have sent a verification code to your registered email. Kindly
            check your email and enter the verification code below:
          </label>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Enter verification token"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Verify Email
          </button>
        </form>
        <p className="text-gray-600 mt-4">{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
