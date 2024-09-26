// import React from "react";

// function SignIn() {
//   return <div>SignIn</div>;
// }

// export default SignIn;

// "use client";
// import { useSession, signIn, signOut } from "next-auth/react";
// import React from "react";
// import Image from "next/image";

// const Signin = () => {
//   const { data: session, status } = useSession(); // Destructure session and status
//   console.log(session);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
//       {status === "authenticated" ? (
//         <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">
//             Welcome back, {session?.user?.name}!
//           </h2>

//           {/* Display user profile image if available */}
//           {session?.user?.image && (
//             <Image
//               src={session.user.image}
//               height={80}
//               width={80}
//               alt="Profile Image"
//               className="rounded-full mb-4 shadow-md"
//             />
//           )}

//           <p className="text-gray-600 mb-6">
//             We are glad to have you here! Feel free to explore.
//           </p>

//           {/* Creative styled sign-out button */}
//           <button
//             onClick={() => signOut()}
//             className="px-6 py-2 text-white bg-red-500 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-105 transition-transform"
//           >
//             Sign Out
//           </button>
//         </div>
//       ) : (
//         <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//           <div className="text-center">
//             <h2 className="mt-6 text-lg sm:text-2xl font-bold text-gray-900">
//               Sign in to your account
//             </h2>
//           </div>

//           {/* Sign in with GitHub */}
//           <button
//             onClick={() => signIn("github")}
//             className="w-full flex justify-center items-center px-4 py-2 mt-4 bg-gray-600 text-white
//           font-semibold rounded-md shadow hover:bg-gray-700 gap-2 sm:gap-4"
//           >
//             <div>
//               <Image
//                 src="/github.png"
//                 height={20}
//                 width={20}
//                 alt="Google Logo"
//               ></Image>
//             </div>
//             <div>Sign in with GitHub</div>
//           </button>

//           {/* Sign in with Google */}
//           <button
//             onClick={() => signIn("google")}
//             className="w-full flex justify-center items-center px-4 py-2 mt-4 bg-white text-black
//           font-semibold rounded-md shadow hover:bg-gray-100 gap-2 sm:gap-4"
//           >
//             <div>
//               <Image
//                 src="/google.png"
//                 height={20}
//                 width={20}
//                 alt="Google Logo"
//               ></Image>
//             </div>
//             <div>Sign in with Google</div>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Signin;

// "use client";
// import { useSession, signIn, signOut } from "next-auth/react";
// import React, { useState, ChangeEvent, FormEvent } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// // TypeScript interface for email sign-in form data
// interface SignInFormData {
//   email: string;
//   password: string;
// }

// const Signin: React.FC = () => {
//   const { data: session, status } = useSession(); // Destructure session and status
//   const [formData, setFormData] = useState<SignInFormData>({
//     email: "",
//     password: "",
//   });

//   // Handle input changes for email/password
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle email sign-in submission
//   const router = useRouter();
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const formData = new FormData(e.currentTarget);
//     const res = await signIn("credentials", {
//       redirect: false,
//       email: formData.get("email"),
//       password: formData.get("password"),
//     });

//     // const result = await signIn("credentials", {
//     //   redirect: false,
//     //   email: formData.email,
//     //   password: formData.password,
//     // });

//     // if (result?.error) {
//     //   alert(result.error);
//     // }

//     console.log({ res });
//     if (!res?.error) {
//       router.push("/dashboard");
//       router.refresh();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
//       {status === "authenticated" ? (
//         <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">
//             Welcome back, {session?.user?.name}!
//           </h2>

//           {/* Display user profile image if available */}
//           {session?.user?.image && (
//             <Image
//               src={session.user.image}
//               height={80}
//               width={80}
//               alt="Profile Image"
//               className="rounded-full mb-4 shadow-md"
//             />
//           )}

//           <p className="text-gray-600 mb-6">
//             We are glad to have you here! Feel free to explore.
//           </p>

//           {/* Creative styled sign-out button */}
//           <button
//             onClick={() => signOut()}
//             className="px-6 py-2 text-white bg-red-500 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-105 transition-transform"
//           >
//             Sign Out
//           </button>
//         </div>
//       ) : (
//         <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//           <div className="text-center">
//             <h2 className="mt-6 text-lg sm:text-2xl font-bold text-gray-900">
//               Sign in to your account
//             </h2>
//           </div>

//           {/* Email Sign-in Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 id="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 id="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-colors duration-300"
//             >
//               Sign In with Email
//             </button>
//           </form>

//           {/* Sign in with GitHub */}
//           <button
//             onClick={() => signIn("github")}
//             className="w-full flex justify-center items-center px-4 py-2 mt-4 bg-gray-600 text-white
//             font-semibold rounded-md shadow hover:bg-gray-700 gap-2 sm:gap-4"
//           >
//             <div>
//               <Image
//                 src="/github.png"
//                 height={20}
//                 width={20}
//                 alt="GitHub Logo"
//               />
//             </div>
//             <div>Sign in with GitHub</div>
//           </button>

//           {/* Sign in with Google */}
//           <button
//             onClick={() => signIn("google")}
//             className="w-full flex justify-center items-center px-4 py-2 mt-4 bg-white text-black
//             font-semibold rounded-md shadow hover:bg-gray-100 gap-2 sm:gap-4"
//           >
//             <div>
//               <Image
//                 src="/google.png"
//                 height={20}
//                 width={20}
//                 alt="Google Logo"
//               />
//             </div>
//             <div>Sign in with Google</div>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Signin;

import React from "react";
import SigninForm from "./Form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Signin() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div>
      <SigninForm />
    </div>
  );
}

export default Signin;
