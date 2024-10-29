"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupSchema } from "@/zod/signupSchema";

import { Eye, EyeOff, LoaderCircle } from "lucide-react"; // Importing icons from lucide-react
import toast, { Toaster } from "react-hot-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Great_Vibes, Montserrat } from "@next/font/google";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: "300" });
// Define TypeScript interface for form data
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm = ({ token }: { token: string }) => {
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    }
  }, [token]);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password, confirmPassword } = formData;

    // Zod Validation
    try {
      const result = signupSchema.safeParse({
        name,
        email,
        password,
        confirmPassword,
      });
      if (!result.success) {
        const fieldErrors: Partial<FormData> = {};
        result.error.errors.forEach((err) => {
          const fieldName = err.path[0] as keyof FormData;
          fieldErrors[fieldName] = err.message;
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      // ReCAPTCHA Execution
      let reCaptchaToken = "";
      try {
        if (!executeRecaptcha) {
          toast.error("reCAPTCHA not available");
          setLoading(false);
          return;
        }
        reCaptchaToken = await executeRecaptcha("form_submit");

        // Token Retrieval
        let authToken = token;
        try {
          if (!authToken) {
            authToken = localStorage.getItem("authToken") || "";
            if (!authToken) {
              toast.error("Not Authenticated.");
              setLoading(false);
              return;
            }

            // API Call
            try {
              const registrationResponse = await fetch("/api/signup", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: authToken,
                },
                body: JSON.stringify({ name, email, password, reCaptchaToken }),
              });
              if (registrationResponse.status === 400) {
                toast.error("ReCaptcha Error");
                return;
              } else if (registrationResponse.status === 403) {
                toast.error("Session Error");
                return;
              } else if (registrationResponse.status === 429) {
                setErrors({
                  email: "Too many requests. Please try again later.",
                });
                return;
              } else if (registrationResponse.status === 409) {
                setErrors({ email: "use already exist." });
                setLoading(false);
                return;
              } else {
                toast.success("Registration Successful. Redirecting...");
                router.push(
                  `/auth/verify-email?email=${encodeURIComponent(email)}`
                );
                router.refresh();
              }
            } catch (apiError) {
              console.error("API error:", apiError);
              toast.error("Registration failed. Please try again.");
            }
          }
        } catch (tokenError) {
          console.error("Token retrieval error:", tokenError);
          toast.error("Failed to retrieve token.");
          setLoading(false);
          return;
        }
      } catch (reCaptchaError) {
        console.error("reCAPTCHA error:", reCaptchaError);
        toast.error("Failed to execute reCAPTCHA.");
        setLoading(false);
        return;
      }
    } catch (validationError) {
      console.error("Validation error:", validationError);
      toast.error("Data validation failed.");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section with Logo and Slogan */}
      <div className="flex items-center w-1/2 justify-center min-h-screen bg-blue-00">
        <div className=" flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 relative rounded-lg shadow-lg overflow-hidden p-4">
          {/* Circle Gradient at Bottom Left */}
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-br from-white to-blue-400 opacity-60 rounded-full transform -translate-x-1/4 translate-y-1/4 shadow-xl shadow-black"></div>
          <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-to-br from-white to-blue-400 opacity-60 rounded-full transform -translate-x-1/4 translate-y-1/4 shadow-xl shadow-black"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-white to-yellow-400 opacity-100 rounded-full transform -translate-x-1/4 translate-y-1/4 shadow-xl shadow-black">
            {" "}
            <Image
              src="/AFLogo.png" // Replace with the path to your logo
              width={150}
              height={150}
              alt="Logo"
              className="mt-4 mx-auto opacity-100"
            />
            <div className="absolute top-0 left-0 w-10 h-10 bg-gradient-to-br from-white to-blue-400  rounded-full transform translate-x-1/4 translate-y-1/4 shadow-xl shadow-black"></div>
          </div>
          <div className="absolute top-0 left-0 w-10 h-10 bg-gradient-to-br from-white to-red-400 opacity-60 rounded-full transform translate-x-1/4 translate-y-1/4 shadow-xl shadow-black"></div>
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-blue-100 opacity-20" />

          {/* Content */}
          <div className="text-center text-slate-800 z-10">
            <h1 className={`${greatVibes.className} text-6xl font-bold mb-4`}>
              My Resume
            </h1>
            <p className={`${montserrat.className} text-lg italic`}>
              Design. Disseminate. Dominate.{" "}
            </p>
          </div>
        </div>
      </div>

      {/* Right Section with Sign-up Form */}
      <div className="flex flex-col w-1/2 items-center justify-center min-h-screen py-2 bg-gray-50">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-2xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`block w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              />

              <button
                type="button"
                className="absolute inset-y-0 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
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
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full px-4 py-2 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              />

              <button
                type="button"
                className="absolute inset-y-0 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <span>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </span>
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white font-semibold rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-sky-500 hover:from-sky-500 hover:to-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-transform transform-gpu 
                ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-sky-500 hover:underline">
              Sign In
            </Link>
          </div>
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
            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => signIn("google")}
                className={`w-full flex justify-center items-center px-4 py-2 mt-4 bg-white text-black font-semibold rounded-md shadow hover:bg-gray-200 transition-colors duration-300 gap-2 sm:gap-4
              ${loading ? "bg-gray-400 cursor-not-allowed" : ""}  `}
                disabled={loading}
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
                className={`w-full flex justify-center items-center px-4 py-2 mt-4 bg-gray-800 text-white font-semibold rounded-md shadow hover:bg-gray-900 transition-colors duration-300 gap-2 sm:gap-4
                ${loading ? "bg-gray-400 cursor-not-allowed" : ""}  `}
                disabled={loading}
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
      </div>
    </div>
  );
};
export default SignUpForm;
