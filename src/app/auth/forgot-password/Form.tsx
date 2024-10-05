// // import React from "react";

// // function ForgotPasswordForm() {
// //   return <div>ForgotPasswordForm</div>;
// // }

// // export default ForgotPasswordForm;

// "use client";

// import React, { useState, ChangeEvent, FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";

// const ForgotPasswordForm: React.FC = () => {
//   const [email, setEmail] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

//   // Handle email input change
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setEmail(e.target.value);
//   };

//   // Handle form submission
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch("/api/forgot-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success("Password reset link sent! Check your email.", {
//           duration: 3000,
//           style: {
//             fontSize: "16px",
//             borderRadius: "10px",
//             padding: "16px",
//             backgroundColor: "#1f2937",
//             color: "#fff",
//           },
//         });
//         setTimeout(() => router.push("/signin"), 4000); // Redirect to sign-in page
//       } else {
//         toast.error(data.error || "An error occurred. Please try again.", {
//           duration: 3000,
//           style: {
//             fontSize: "16px",
//             borderRadius: "10px",
//             padding: "16px",
//             backgroundColor: "#f87171",
//             color: "#fff",
//           },
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to send reset link. Try again later.", {
//         duration: 3000,
//         style: {
//           fontSize: "16px",
//           borderRadius: "10px",
//           padding: "16px",
//           backgroundColor: "#f87171",
//           color: "#fff",
//         },
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
//       {/* Toast notifications */}
//       <Toaster position="top-right" reverseOrder={false} />

//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h2 className="mt-6 text-lg sm:text-2xl font-bold text-gray-900">
//             Forgot your password?
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Enter your email, and we’ll send you a reset code.
//           </p>
//         </div>

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
//               value={email}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-colors duration-300"
//           >
//             {loading ? "Sending..." : "Send Reset Code"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordForm;

"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log("Error Sending email" + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
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
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

// "use client";

// import React, { useState, ChangeEvent, FormEvent } from "react";

// const ForgotPasswordForm: React.FC = () => {
//   const [email, setEmail] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   // Handle email input change
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setEmail(e.target.value);
//   };

//   // Handle form submission
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `/api/forgot-password?email=${encodeURIComponent(email)}`,
//         {
//           method: "GET",
//         }
//       );

//       const data = await res.json();

//       console.log(data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h2 className="mt-6 text-lg sm:text-2xl font-bold text-gray-900">
//             Forgot your password?
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Enter your email, and we’ll send you a reset code.
//           </p>
//         </div>

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
//               value={email}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-colors duration-300"
//           >
//             {loading ? "Sending..." : "Send Reset Code"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordForm;
