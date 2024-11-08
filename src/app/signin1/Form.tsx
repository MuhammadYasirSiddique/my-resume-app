"use client";
import { signIn } from "next-auth/react";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Great_Vibes, Montserrat } from "next/font/google";
import toast from "react-hot-toast";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: "300" });

// TypeScript interface for email sign-in form data
interface SignInFormData {
  email: string;
  password: string;
}

// Set up font styles outside the component

const SigninForm = ({ token }: { token: string }) => {
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    }
  }, [token]);
  // console.log("Token Rcvd from Page...." + token);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null); // New message state
  const router = useRouter();

  // Handle input changes for email/password
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle email sign-in submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Clear previous messages
    const formData = new FormData(e.currentTarget);

    let reCaptchaToken = "";
    try {
      if (!executeRecaptcha) {
        toast.error("reCAPTCHA not available");
        setLoading(false);
        return;
      }
      reCaptchaToken = await executeRecaptcha("form_submit");
      // console.log(reCaptchaToken);

      // Token Retrieval
      const authToken = token;
      // console.log("authTOken Assigned Value : --" + authToken);
      try {
        if (!authToken) {
          toast.error("Not Authenticated.");
          setLoading(false);
          return;
        } else {
          // console.log(authToken);
          try {
            // Perform the sign-in request
            const res = await signIn("credentials", {
              redirect: false,
              email: formData.get("email"),
              password: formData.get("password"),
              reCaptchaToken,
              authToken,
            });

            // console.log(window.location.href);
            // console.log("Response from signIn:", res); // Inspect for any anomalies

            const email = formData.get("email") as string;

            // console.log("Status returned from Server:  - " + res?.status);

            // Check for errors in the response
            if (res?.error) {
              if (res?.status === 429) {
                setMessage("Too many requests. Please try again later.");
                setLoading(false);
                return;
              }
              // console.log(res.error);
              if (res.error === "Session/API Key validation failed.") {
                setMessage("Session/API Key validation failed.");
                return;
              }

              if (res.error === "Invalid User ID or Password.") {
                // Show a message with "Email not verified" message
                setMessage("Invalid User ID or Password");
                return;
              }
              if (res.error === "Invalid credentials.") {
                // Show a message with "Email not verified" message
                setMessage("Invalid credentials.");
                return;
              }

              if (res.error === "Email not verified.") {
                // Show a message with "Email not verified" message
                setMessage(
                  "Email not verified. Redirecting to verification page..."
                );

                // Redirect to the verify-email page
                router.push(
                  `/auth/verify-email?email=${encodeURIComponent(email)}`
                );
                setLoading(false);
                return;
              }

              // For any other errors, show a generic error message
              setMessage("Failed to sign in. Please check your credentials.");
              setLoading(false);
              return;
            }

            // Successful sign-in: Show success message and redirect to dashboard
            if (res?.status === 200) {
              setMessage("Signed in successfully!. Redirecting...");
              setLoading(false);
              router.push("/dashboard");
              router.refresh();
            }
          } catch (error) {
            console.error("Error during sign-in:", error);
            setMessage("An unexpected error occurred. Please try again later.");
            // router.push(
            //   `/auth/error?error=${encodeURIComponent("Something went wrong.")}`
            // );
            // router.refresh();
          }
        }
      } catch (tokenError) {
        console.error("Token retrieval error:", tokenError);
        toast.error("Session invalid of Expired.");
        setLoading(false);
        return;
      }
    } catch (reCaptchaError) {
      console.error("reCAPTCHA error:", reCaptchaError);
      toast.error("ReCAPTCHA failed.");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex flex-col w-full lg:w-1/2 items-center justify-center min-h-screen py-2 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-2xl">
          <div className="text-center">
            <h2 className="mt-6 text-lg sm:text-2xl font-bold text-gray-900">
              Sign in to your account
            </h2>
          </div>

          {/* Email Sign-in Form */}
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
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>
                Do not have an account?
                <Link href="/signup">
                  <span className="text-indigo-600"> Register here.</span>
                </Link>
              </span>
              <Link href="/auth/forgot-password">
                <span className="text-indigo-600"> Forget Password</span>
              </Link>
            </div>

            {/* Display message if exists */}
            {/* {message && (
            <div
              className="
           bg-red-100 
          text-red-700 p-4 rounded-md text-center"
            >
              {message}
            </div>
          )} */}
            {message && (
              <div className="text-red-700 mt-2 text-sm text-center">
                {message}
              </div>
            )}

            <button
              type="submit"
              className={`w-full h-10 px-4 py-2 text-white font-semibold rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-sky-500 hover:from-sky-500 hover:to-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-transform transform-gpu 
                ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Sign in with Google */}
          <button
            onClick={() => signIn("google")}
            className={`w-full h-10 flex justify-center items-center px-4 py-2 mt-4 bg-white text-black 
            font-semibold rounded-md shadow hover:bg-gray-100 gap-2 sm:gap-4
            ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            <div>
              <Image
                src="/google.png"
                height={20}
                width={20}
                alt="Google Logo"
              />
            </div>
            <div>Sign in with Google</div>
          </button>

          {/* Sign in with GitHub */}
          <button
            onClick={() => signIn("github")}
            className={`w-full flex justify-center items-center px-4 py-2 mt-4 bg-gray-600 text-white 
            font-semibold rounded-md shadow hover:bg-gray-700 gap-2 sm:gap-4
            ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            <div>
              <Image
                src="/github.png"
                height={20}
                width={20}
                alt="GitHub Logo"
              />
            </div>
            <div>Sign in with GitHub</div>
          </button>
        </div>
      </div>

      {/* Right Section with Logo and Slogan */}
      <div className="flex items-center w-full h-60 lg:h-screen lg:w-1/2 justify-center lg:min-h-screen bg-blue-100">
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 relative rounded-lg shadow-lg overflow-hidden p-4">
          {/* Circle Gradients */}
          <div className="absolute bottom-0 right-0 w-3/4 h-3/4 lg:w-full lg:h-full bg-gradient-to-br from-white to-blue-400 opacity-60 rounded-full transform translate-x-1/4 translate-y-1/4 shadow-xl shadow-black hidden sm:block"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 lg:w-3/4 lg:h-3/4 bg-gradient-to-br from-white to-blue-400 opacity-60 rounded-full transform translate-x-1/4 translate-y-1/4 shadow-xl shadow-black hidden sm:block"></div>

          {/* Logo Section */}
          <div className="absolute top-0 left-0 sm:w-48 sm:h-48 w-36 h-36 bg-gradient-to-br from-white to-blue-400 opacity-100 rounded-full transform translate-x-1/4 translate-y-1/4 shadow-xl shadow-black">
            <Image
              src="/AFLogo.png"
              width={100} // Adjust for small screens
              height={100} // Adjust for small screens
              alt="Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-42 lg:h-42 mt-6 mx-auto opacity-100"
            />
            <div className="absolute top-0 right-0 w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-white to-amber-900 rounded-full transform -translate-x-1/4 translate-y-1/4 shadow-xl shadow-black"></div>
          </div>

          {/* Additional Circle on Top Right */}
          <div className="absolute top-0 right-0  lg:w-10 lg:h-10 bg-gradient-to-br from-white to-amber-900 opacity-100 rounded-full transform -translate-x-1/4 translate-y-1/4 shadow-xl shadow-black hidden sm:block"></div>

          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-blue-100 opacity-20 sm:opacity-20" />

          {/* Content */}
          <div className="text-center text-black z-10 px-4 sm:px-0">
            <h1
              className={`${greatVibes.className} text-4xl sm:text-6xl font-bold mb-2 sm:mb-4`}
            >
              My Resume
            </h1>
            <p className={`${montserrat.className} text-md sm:text-lg italic`}>
              Design. Disseminate. Dominate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
