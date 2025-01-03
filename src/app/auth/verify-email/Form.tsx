"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { verifyEmail } from "@/zod/signupSchema";
import toast, { Toaster } from "react-hot-toast";

interface VerifyEmailProps {
  email: string;
  authToken: string;
}

interface verifyCode {
  code: number;
}

const VerifyEmailForm = ({ email, authToken }: VerifyEmailProps) => {
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    }
  }, [authToken]);
  // console.log("authTOken Rcvd;;;; " + authToken);
  const [token, setToken] = useState<string>(""); // Token from the user input
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false); // Loading state for submit
  const [loadingResend, setLoadingResend] = useState<boolean>(false); // Loading state for resend
  const [message, setMessage] = useState<string>("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = parseInt(token); // Convert the token to a number
    const result = verifyEmail.safeParse({ code });

    try {
      // Check if validation failed
      if (!result.success) {
        // Map Zod errors to the string error state
        const fieldErrors: { [key: string]: string } = {};
        result.error.errors.forEach((err) => {
          const fieldName = err.path[0] as keyof verifyCode;
          fieldErrors[fieldName] = err.message;
        });
        setErrors(fieldErrors); // Set string error messages
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

        try {
          const aToken = localStorage.getItem("authToken");
          if (!aToken) {
            toast.error("Not Authenticated.");
            setLoading(false);
            return;
          }
          // console.log(aToken);

          if (token && email) {
            setLoading(true); // Set loading to true during the API call
            try {
              const response = await fetch("/api/emailVerify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: aToken,
                },
                body: JSON.stringify({ email, token, reCaptchaToken }),
              });

              const data = await response.json();
              // console.log(response.status);
              if (response.status === 429) {
                setMessage("Too many requests. Please try again later.");
                return;
              }
              if (response.ok) {
                setMessage(
                  "Email verified successfully!. Redirecting to Sign-in..."
                );
                setTimeout(() => {
                  router.push("/signin");
                }, 2000);
              } else {
                setMessage(data.message || "Email verification failed.");
              }
            } catch (error) {
              console.log(error);
              setMessage("An error occurred during verification.");
            } finally {
              setLoading(false); // Set loading to false after the API call
              setToken(""); // Clear the token input after submission
            }
          } else {
            setMessage("Please enter a valid token.");
          }
        } catch {
          console.log("Session Validation Failed");
          setMessage("Session Validation Failed");
        }
      } catch {
        console.log("ReCaptcha unseccessul");
        setMessage("ReCaptcha unseccessul");
        setLoading(false);
      }
    } catch {
      console.log("Input Validation Failed");
      setMessage("Input Validation Failed");
      setLoading(false);
    }
  };
  const handleResendVerification = async () => {
    setLoadingResend(true); // Set loading for resend button
    if (!email) {
      setMessage("Email not found.");
      setLoadingResend(false);
      return;
    }
    // ReCAPTCHA Execution
    let reCaptchaToken = "";
    try {
      // console.log("ReCpatcha....");
      if (!executeRecaptcha) {
        toast.error("reCAPTCHA not available");
        setLoading(false);
        return;
      }
      reCaptchaToken = await executeRecaptcha("resend_email");
      // console.log(reCaptchaToken);

      const aToken = localStorage.getItem("authToken");
      try {
        // console.log("Auth Token:-  Resend email :" + aToken);
        if (!aToken) {
          toast.error("Not Authenticated.");
          setLoading(false);
          return;
        }
        // console.log(authToken);

        try {
          const response = await fetch("/api/resendVerification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: aToken,
            },
            body: JSON.stringify({ email, reCaptchaToken }),
          });

          const data = await response.json();

          if (response.status === 429) {
            setMessage("Too many requests. Please try again later.");
            return;
          }

          if (response.ok) {
            setMessage("Verification email resent successfully!");
          } else {
            setMessage(data.message || "Failed to resend verification email.");
          }
        } catch (error) {
          console.log(error);
          setMessage("An error occurred while resending verification email.");
        }
      } catch {
        console.log("Session Validation Failed");
        setMessage("Session Validation Failed");
      }
    } catch {
      console.log("ReCaptcha unseccessul");
      setMessage("ReCaptcha unseccessul");
      setLoading(false);
    } finally {
      setLoadingResend(false); // Set loading to false after response
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow only numbers and limit to 6 digits
    if (/^\d{0,6}$/.test(input)) {
      setToken(input);
      setErrors({}); // Clear any existing errors on input change
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
            onChange={handleChange}
            // onChange={(e) => setToken(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.code ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="Enter verification token"
            required
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-500">{errors.code}</p>
          )}

          {message && (
            <p
              className={`text-center mt-2 ${
                message.includes("successful")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            className=" mt-10 w-full h-10 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            disabled={loading} // Disable the button when loading
          >
            {loading ? (
              <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        {/* Resend verification link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Did not get the verification code?
          </p>
          <button
            onClick={handleResendVerification}
            className="text-blue-600 hover:underline text-sm"
            disabled={loadingResend} // Disable the button when loading
          >
            {loadingResend ? (
              <LoaderCircle className="animate-spin h-5 w-5 inline-block" />
            ) : (
              "Resend"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
