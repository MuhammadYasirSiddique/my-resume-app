"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface VerifyEmailProps {
  email: string;
}

const VerifyEmailForm = ({ email }: VerifyEmailProps) => {
  const [token, setToken] = useState<string>(""); // Token from the user input

  const [submittedToken, setSubmittedToken] = useState<string | null>(null);

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false); // Loading state for both submit and resend
  const [loadingResend, setLoadingResend] = useState<boolean>(false);

  useEffect(() => {
    if (submittedToken && email) {
      // Function to send POST request to the server to verify email
      const verifyEmail = async () => {
        setLoading(true);
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
            toast.success("Email verified successfully!");
            router.push("/signin");
          } else {
            toast.error(data.message || "Email verification failed.");
          }
        } catch (error) {
          console.error("Error verifying email:", error);
          toast.error("An error occurred during verification.");
        } finally {
          setLoading(false); // Set loading to false after response
        }
      };

      verifyEmail();
    }
  }, [submittedToken, email, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (token && email) {
      setSubmittedToken(token); // Set the submitted token to trigger useEffect
      setToken(""); // Clear the input field after submission
    } else {
      toast.error("Please enter a valid token.");
    }
  };

  const handleResendVerification = async () => {
    setLoadingResend(true);
    if (!email) {
      toast.error("Email not found.");
      setLoading(false);
      return;
    }

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
        toast.success("Verification email resent successfully!");
      } else {
        toast.error(data.message || "Failed to resend verification email.");
      }
    } catch (error) {
      console.error("Error resending email:", error);
      toast.error("An error occurred while resending verification email.");
    } finally {
      setLoadingResend(false); // Set loading to false after response
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
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
            disabled={loading} // Disable the button when loading
          >
            {loading ? (
              <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        {/* <p className="text-gray-600 mt-4">{message}</p> */}

        {/* Resend verification link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Did not get the verification code?
          </p>
          <button
            onClick={handleResendVerification}
            className="text-blue-600 hover:underline text-sm"
            disabled={loading} // Disable the button when loading
          >
            {loadingResend ? (
              <LoaderCircle className="animate-spin h-5 w-5 inline-block" />
            ) : (
              "Resend"
            )}
          </button>
          {/* <p className="text-gray-600 mt-2">{resendMessage}</p> */}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
