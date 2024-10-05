"use client";

import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  // Handle email input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      console.log(email);

      // console.log("Status Code : - " + data.status);
      if (res.status === 200) {
        toast.success("Password reset link sent! Check your email.", {
          duration: 2000,
          style: {
            fontSize: "16px",
            borderRadius: "10px",
            padding: "16px",
            backgroundColor: "#1f2937",
            color: "#fff",
          },
        });
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 2000);
      } else if (res.status === 404) {
        toast.error("No user is registered with this email", {
          duration: 2000,
          style: {
            fontSize: "16px",
            borderRadius: "10px",
            padding: "16px",
            backgroundColor: "#1f2937",
            color: "#fff",
          },
        });

        router.push("/signup");
        router.refresh();
      }
    } catch (error) {
      console.log("Error Sending email" + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-lg sm:text-2xl font-bold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email, and we’ll send you a reset code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-colors duration-300"
          >
            {loading ? (
              <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
            ) : (
              "Send Reset Code"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
