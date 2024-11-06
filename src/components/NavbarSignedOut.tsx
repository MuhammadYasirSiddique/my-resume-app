// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import React from "react";
// import { Menu, X } from "lucide-react"; // Importing icons from lucide-react

// function Navbar() {
//   const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

//   // Function to toggle the mobile menu visibility
//   const toggleMobileMenu = () => {
//     setMobileMenuVisible(!mobileMenuVisible);
//   };

//   // Close menu if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       if (!target.closest(".menu-button") && !target.closest(".sub-menu")) {
//         setMobileMenuVisible(false); // Close mobile menu on click outside
//       }
//     };

//     if (mobileMenuVisible) {
//       document.addEventListener("click", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, [mobileMenuVisible]);

//   return (
//     <div className="mx-10 mt-5 flex justify-between items-center">
//       <div>
//         <Link href="/">
//           <button>
//             <h1 className="text-lg">My Resume</h1>
//           </button>
//         </Link>
//       </div>

//       {/* Hamburger menu icon for small screens */}
//       <button
//         className={`menu-button lg:hidden transition-all duration-300 ${
//           mobileMenuVisible ? "rotate-90" : ""
//         }`}
//         onClick={toggleMobileMenu}
//       >
//         {mobileMenuVisible ? <X size={30} /> : <Menu size={30} />}
//       </button>

//       {/* Links for desktop */}
//       <div className="hidden lg:block">
//         <ul className="flex gap-4">
//           <li>
//             <Link href="/signup">
//               <button>Register</button>
//             </Link>
//           </li>
//           <li>
//             <Link href="/signin">
//               <button>Sign-in</button>
//             </Link>
//           </li>
//         </ul>
//       </div>

//       {/* Mobile Menu with sliding effect */}
//       <div
//         className={`absolute top-14 z-50 right-0 w-48 bg-white shadow-lg rounded-md p-4 lg:hidden sub-menu transition-all duration-300 ${
//           mobileMenuVisible ? "slide-down" : "slide-up"
//         }`}
//         style={{ visibility: mobileMenuVisible ? "visible" : "hidden" }}
//       >
//         <ul className="flex flex-col gap-4">
//           <li>
//             <Link href="/signup">
//               <button onClick={() => setMobileMenuVisible(false)}>
//                 Register
//               </button>
//             </Link>
//           </li>
//           <li>
//             <Link href="/signin">
//               <button onClick={() => setMobileMenuVisible(false)}>
//                 Sign-in
//               </button>
//             </Link>
//           </li>
//         </ul>
//       </div>

//       {/* Styles for sliding effect */}
//       <style jsx>{`
//         .slide-up {
//           transform: translateY(-20px);
//           opacity: 0;
//         }
//         .slide-down {
//           transform: translateY(0);
//           opacity: 1;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default Navbar;

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import React from "react";
import { Menu, X } from "lucide-react"; // Importing icons from lucide-react
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

function Navbar() {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // Function to toggle the mobile menu visibility
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".menu-button") && !target.closest(".sub-menu")) {
        setMobileMenuVisible(false); // Close mobile menu on click outside
      }
    };

    if (mobileMenuVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [mobileMenuVisible]);

  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-blue-800 to-blue-500 p-4  shadow-md">
      <div className={`${greatVibes.className} `}>
        <Link href="/">
          <button className="text-white font-thin text-4xl transition-all hover:text-blue-200 glow-amber">
            My Resume
          </button>
        </Link>
      </div>

      {/* Hamburger menu icon for small screens */}
      <button
        className={`menu-button lg:hidden text-white transition-all duration-300 transform ${
          mobileMenuVisible ? "rotate-90" : ""
        }`}
        onClick={toggleMobileMenu}
      >
        {mobileMenuVisible ? <X size={30} /> : <Menu size={30} />}
      </button>

      {/* Links for desktop */}
      <div className="hidden lg:flex gap-4">
        <Link href="/signup">
          <button className="text-white bg-blue-800 px-4 py-2 rounded-full transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-amber-800">
            Register
          </button>
        </Link>
        <Link href="/signin">
          <button className="text-white bg-blue-800 px-4 py-2 rounded-full transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-amber-800">
            Sign-in
          </button>
        </Link>
      </div>

      {/* Colorful Mobile Menu with sliding effect */}
      <div
        className={`absolute top-16 z-50 right-0 w-48 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 
          shadow-lg rounded-md p-4 lg:hidden sub-menu transition-all duration-300 ${
            mobileMenuVisible ? "slide-down" : "slide-up"
          }`}
        style={{ visibility: mobileMenuVisible ? "visible" : "hidden" }}
      >
        <ul className="flex flex-col  font-semibold">
          <li className=" hover:bg-blue-500">
            <Link href="/signup">
              <button
                onClick={() => setMobileMenuVisible(false)}
                className="w-full text-left text-white px-3 py-2   hover:bg-blue-500 transition-all"
              >
                Register
              </button>
            </Link>
          </li>
          <li>
            <Link href="/signin">
              <button
                onClick={() => setMobileMenuVisible(false)}
                className="w-full text-left text-white px-3 py-2   hover:bg-blue-500 transition-all"
              >
                Sign-in
              </button>
            </Link>
          </li>
        </ul>
      </div>

      {/* Styles for sliding effect */}
      <style jsx>{`
        .slide-up {
          transform: translateY(-20px);
          opacity: 0;
        }
        .slide-down {
          transform: translateY(0);
          opacity: 1;
        }

        .glow-amber {
          color: #fb923c; /* amber-800 */
          text-shadow: 0 0 5px rgba(251, 146, 60, 0.5),
            0 0 10px rgba(251, 146, 60, 0.5), 0 0 20px rgba(251, 146, 60, 0.5);
          animation: glow 1.5s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 5px rgba(251, 146, 60, 0.5),
              0 0 10px rgba(251, 146, 60, 0.5), 0 0 20px rgba(251, 146, 60, 0.5);
          }
          to {
            text-shadow: 0 0 10px rgba(251, 146, 60, 0.8),
              0 0 20px rgba(251, 146, 60, 0.8), 0 0 30px rgba(251, 146, 60, 0.8);
          }
        }
      `}</style>
    </div>
  );
}

export default Navbar;
