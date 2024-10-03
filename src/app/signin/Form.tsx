"use client";
import { signIn } from "next-auth/react";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

// TypeScript interface for email sign-in form data
interface SignInFormData {
  email: string;
  password: string;
}

const SigninForm: React.FC = () => {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });

  // Handle input changes for email/password
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const router = useRouter();

  // Handle email sign-in submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Perform the sign-in request
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.get("email"),
      password: formData.get("password"),
    });
    const email = formData.get("email") as string;

    // Check for errors in the response
    if (res?.error) {
      if (res.error === "Email not verified.") {
        // Show a toast with "Email not verified" message
        toast.error("Email not verified. Redirecting to verification page...", {
          duration: 3000,
          style: {
            fontSize: "16px",
            borderRadius: "10px",
            padding: "16px",
            backgroundColor: "#f87171", // Red background for error
            color: "#fff",
          },
        });

        // Redirect to the verify-email page
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }

      // For any other errors, show a generic error toast
      toast.error("Failed to sign in. Please check your credentials.", {
        duration: 2000,
        style: {
          fontSize: "16px",
          borderRadius: "10px",
          padding: "16px",
          backgroundColor: "#f87171",
          color: "#fff",
        },
      });
      return;
    }

    // Successful sign-in: Show success toast and redirect to dashboard
    if (res?.status === 200) {
      toast.success("Signed in successfully!", {
        duration: 2000,
        style: {
          fontSize: "16px",
          borderRadius: "10px",
          padding: "16px",
          backgroundColor: "#1f2937",
          color: "#fff",
        },
      });
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      {/* Render toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
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
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-between text-sm">
            <span>
              Do not have an account?
              <Link href="/signup">
                <span className="text-indigo-600"> Register here.</span>
              </Link>
            </span>
            <Link href="/auth/forgeot-password">
              <span className="text-indigo-600"> Forget Password</span>
            </Link>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-colors duration-300"
          >
            Sign In with Email
          </button>
        </form>

        {/* Sign in with Google */}
        <button
          onClick={() => signIn("google")}
          className="w-full flex justify-center items-center px-4 py-2 mt-4 bg-white text-black 
            font-semibold rounded-md shadow hover:bg-gray-100 gap-2 sm:gap-4"
        >
          <div>
            <Image src="/google.png" height={20} width={20} alt="Google Logo" />
          </div>
          <div>Sign in with Google</div>
        </button>

        {/* Sign in with GitHub */}
        <button
          onClick={() => signIn("github")}
          className="w-full flex justify-center items-center px-4 py-2 mt-4 bg-gray-600 text-white 
            font-semibold rounded-md shadow hover:bg-gray-700 gap-2 sm:gap-4"
        >
          <div>
            <Image src="/github.png" height={20} width={20} alt="GitHub Logo" />
          </div>
          <div>Sign in with GitHub</div>
        </button>
      </div>
    </div>
  );
};

export default SigninForm;
