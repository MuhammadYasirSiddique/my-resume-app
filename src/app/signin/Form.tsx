// "use client";
// import { signIn } from "next-auth/react";
// import React, { useState, ChangeEvent, FormEvent } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
// import Link from "next/link";
// import { Eye, EyeOff, LoaderCircle } from "lucide-react";

// // TypeScript interface for email sign-in form data
// interface SignInFormData {
//   email: string;
//   password: string;
// }

// const SigninForm: React.FC = () => {
//   const [formData, setFormData] = useState<SignInFormData>({
//     email: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   // Handle input changes for email/password
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const router = useRouter();

//   // Handle email sign-in submission
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     const formData = new FormData(e.currentTarget);

//     // Perform the sign-in request
//     const res = await signIn("credentials", {
//       redirect: false,
//       email: formData.get("email"),
//       password: formData.get("password"),
//     });
//     const email = formData.get("email") as string;

//     console.log("Status retuned from Server:  - " + res?.status);

//     // Check for errors in the response
//     if (res?.error) {
//       if (res.error === "Email not verified.") {
//         // Show a toast with "Email not verified" message
//         toast.error("Email not verified. Redirecting to verification page...", {
//           duration: 3000,
//           style: {
//             fontSize: "16px",
//             borderRadius: "10px",
//             padding: "16px",
//             backgroundColor: "#f87171", // Red background for error
//             color: "#fff",
//           },
//         });

//         // Redirect to the verify-email page
//         router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
//         setLoading(false);
//         return;
//       }

//       // For any other errors, show a generic error toast
//       toast.error("Failed to sign in. Please check your credentials.", {
//         duration: 2000,
//         style: {
//           fontSize: "16px",
//           borderRadius: "10px",
//           padding: "16px",
//           backgroundColor: "#f87171",
//           color: "#fff",
//         },
//       });
//       setLoading(false);
//       return;
//     }

//     // Successful sign-in: Show success toast and redirect to dashboard
//     if (res?.status === 200) {
//       toast.success("Signed in successfully!", {
//         duration: 2000,
//         style: {
//           fontSize: "16px",
//           borderRadius: "10px",
//           padding: "16px",
//           backgroundColor: "#1f2937",
//           color: "#fff",
//         },
//       });
//       setLoading(false);
//       router.push("/dashboard");
//       router.refresh();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
//       {/* Render toast notifications */}
//       <Toaster position="top-right" reverseOrder={false} />

//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h2 className="mt-6 text-lg sm:text-2xl font-bold text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>

//         {/* Email Sign-in Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               id="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <div className="relative mt-1">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 id="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span>
//               Do not have an account?
//               <Link href="/signup">
//                 <span className="text-indigo-600"> Register here.</span>
//               </Link>
//             </span>
//             <Link href="/auth/forgot-password">
//               <span className="text-indigo-600"> Forget Password</span>
//             </Link>
//           </div>
//           <button
//             type="submit"
//             className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-colors duration-300
//             ${loading ? "bg-gray-400 cursor-not-allowed" : ""}  `}
//             disabled={loading}
//           >
//             {loading ? (
//               <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
//             ) : (
//               "Sign in"
//             )}
//           </button>
//         </form>

//         {/* Sign in with Google */}
//         <button
//           onClick={() => signIn("google")}
//           className={`w-full flex justify-center items-center px-4 py-2 mt-4 bg-white text-black
//             font-semibold rounded-md shadow hover:bg-gray-100 gap-2 sm:gap-4
//             ${loading ? "bg-gray-400 cursor-not-allowed" : ""}  `}
//           disabled={loading}
//         >
//           <div>
//             <Image src="/google.png" height={20} width={20} alt="Google Logo" />
//           </div>
//           <div>Sign in with Google</div>
//         </button>

//         {/* Sign in with GitHub */}
//         <button
//           onClick={() => signIn("github")}
//           className={`w-full flex justify-center items-center px-4 py-2 mt-4 bg-gray-600 text-white
//             font-semibold rounded-md shadow hover:bg-gray-700 gap-2 sm:gap-4
//             ${loading ? "bg-gray-400 cursor-not-allowed" : ""}  `}
//           disabled={loading}
//         >
//           <div>
//             <Image src="/github.png" height={20} width={20} alt="GitHub Logo" />
//           </div>
//           <div>Sign in with GitHub</div>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SigninForm;

"use client";
import { signIn } from "next-auth/react";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

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

    try {
      // Perform the sign-in request
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.get("email"),
        password: formData.get("password"),
        headers: { "Content-Type": "application/json" },
        // callbackUrl: `${window.location.origin}/dashboard/`,
      });

      // console.log(window.location.href);
      console.log("Response from signIn:", res); // Inspect for any anomalies

      const email = formData.get("email") as string;

      console.log("Status returned from Server:  - " + res?.status);

      if (res?.status === 429) {
        setMessage("Too many requests. Please try again later.");
        setLoading(false);
        return;
      }

      // Check for errors in the response
      if (res?.error) {
        if (res.error === "Email not verified.") {
          // Show a message with "Email not verified" message
          setMessage("Email not verified. Redirecting to verification page...");

          // Redirect to the verify-email page
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
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
      router.push(
        `/auth/error?error=${encodeURIComponent("Something went wrong.")}`
      );
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
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
            className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-colors duration-300
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
          className={`w-full flex justify-center items-center px-4 py-2 mt-4 bg-white text-black 
            font-semibold rounded-md shadow hover:bg-gray-100 gap-2 sm:gap-4
            ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          <div>
            <Image src="/google.png" height={20} width={20} alt="Google Logo" />
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
            <Image src="/github.png" height={20} width={20} alt="GitHub Logo" />
          </div>
          <div>Sign in with GitHub</div>
        </button>
      </div>
    </div>
  );
};

export default SigninForm;
