// pages/auth/error.tsx
"use client";

import { useRouter } from "next/navigation";
// import { useEffect } from "react";

interface ErrorPageProps {
  error?: string;
  url?: string;
}

const AuthErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
  const router = useRouter();

  function handleSubmit() {
    router.push("/signin");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-red-600 mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-700 text-center mb-6">
          {error || "An unknown error occurred during authentication."}
        </p>
        {/* <ul>
          <li>* Too Many login attempts</li>
          <li>* Server Error</li>
        </ul> */}

        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Go to Signin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorPage;
