"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast"; // Import toast and Toaster
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define TypeScript interface for form data
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input change with type safety
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const registrationPromise = fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    console.log("Promise " + (await registrationPromise).status);
    if ((await registrationPromise).status === 401) {
      console.log("Email " + email + " already taken");
      return toast.error("Email already taken");
    }

    toast.promise(
      registrationPromise,
      {
        loading: "Registering...",
        success: (response) => {
          if (!response.ok) {
            throw new Error("Failed to register from toast.promise");
          }
          // toast.success("User registered successfully!");
          // router.push("/verify-email", { state: { email } }); // Redirect on successful sign-up with email address in router state
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);

          router.refresh();
          return "User registered, Verfication email sent to your email address.";
        },
        error: (error) => {
          console.error(error);
          // toast.error("Unable to Register.");
          return "Registration failed. Please try again.";
        },
      },
      {
        duration: 2000, // Duration of the toast (ms)
        style: {
          fontSize: "16px", // Control the size of the text
          borderRadius: "10px", // Add a border radius
          padding: "16px", // Increase the padding for better spacing
          backgroundColor: "#1f2937", // Custom dark background color
          color: "#fff", // White text color for better readability
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        },
        // icon: "🚀",
      } // Custom icon
    );
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />{" "}
      {/* Add Toaster here to display the toast notifications */}
      <div className="flex flex-col items-center justify-center min-h-screen py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
            Create your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your full name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Re-enter your password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <span className="text-sm">
              Already have an account?
              <Link href="/signin">
                <span className="text-indigo-600"> Sign In</span>
              </Link>
            </span>
            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 transition-colors duration-300"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <button
              onClick={() => signIn("google")}
              className="w-full flex justify-center items-center px-4 py-2 mt-4 bg-white text-black font-semibold rounded-md shadow hover:bg-gray-200 transition-colors duration-300 gap-2 sm:gap-4"
            >
              <Image
                src="/google.png"
                height={20}
                width={20}
                alt="Google Logo"
              />
              <span>Sign up with Google</span>
            </button>

            <button
              onClick={() => signIn("github")}
              className="w-full flex justify-center items-center px-4 py-2 mt-4 bg-gray-800 text-white font-semibold rounded-md shadow hover:bg-gray-900 transition-colors duration-300 gap-2 sm:gap-4"
            >
              <Image
                src="/github.png"
                height={20}
                width={20}
                alt="GitHub Logo"
              />
              <span>Sign up with GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
