"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { useRouter } from "next/navigation";

const VerifyEmail = () => {
  const [token, setToken] = useState<string>(""); // Token from the user input
  const [message, setMessage] = useState(""); // Message to display status
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState(""); // Resend status message
  const searchParams = useSearchParams(); // Get query parameters
  const email = searchParams.get("email"); // Retrieve the email from the query params
  const router = useRouter();
  // console.log(email);

  useEffect(() => {
    if (submittedToken && email) {
      setMessage("Verifying your email...");

      // Function to send POST request to the server to verify email
      const verifyEmail = async () => {
        try {
          const response = await fetch("/api/emailVerify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, token: submittedToken }),
          });

          const data = await response.json();
          console.log("API Response:", data);

          if (response.ok) {
            setMessage("Email verified successfully!");
            router.push("/signin");
          } else {
            setMessage(data.message || "Email verification failed.");
          }
        } catch (error) {
          console.error("Error verifying email:", error);
          setMessage("An error occurred during verification.");
        }
      };

      verifyEmail();
    }
  }, [submittedToken, email, router]); // Re-run the effect when submittedToken or email changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token && email) {
      setSubmittedToken(token); // Set the submitted token to trigger useEffect
      setToken(""); // Clear the input field after submission
    } else {
      setMessage("Please enter a valid token.");
    }
  };

  // Function to handle resending the verification email
  const handleResendVerification = async () => {
    if (!email) {
      setResendMessage("Email not found.");
      return;
    }

    setResendMessage("Resending verification email...");

    try {
      const response = await fetch("/api/resendVerification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage("Verification email resent successfully!");
      } else {
        setResendMessage(
          data.message || "Failed to resend verification email."
        );
      }
    } catch (error) {
      console.error("Error resending email:", error);
      setResendMessage("An error occurred while resending verification email.");
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

        {/* Resend verification link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Did not get the verification code?
          </p>
          <button
            onClick={handleResendVerification}
            className="text-blue-600 hover:underline text-sm"
          >
            Resend
          </button>
          <p className="text-gray-600 mt-2">{resendMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
