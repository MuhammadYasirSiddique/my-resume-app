// "use client";
// import Link from "next/link";
// import React from "react";
// // import { useSession } from "next-auth/react";

// function Navbar() {
//   return (
//     <div className="mx-10 mt-5 flex justify-between">
//       <div>
//         <Link href="/">
//           <button>
//             <h1>My Resume</h1>
//           </button>
//         </Link>
//       </div>
//       <div>
//         <ul className="flex gap-4">
//           <li>
//             <Link href="/signup">
//               <button>Register </button>
//             </Link>
//           </li>
//           <li>
//             {" "}
//             <Link href="/signin">
//               <button>Sign-in </button>
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Navbar;
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import React from "react";
import { Menu, X } from "lucide-react"; // Importing icons from lucide-react

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
    <div className="mx-10 mt-5 flex justify-between items-center">
      <div>
        <Link href="/">
          <button>
            <h1 className="text-lg">My Resume</h1>
          </button>
        </Link>
      </div>

      {/* Hamburger menu icon for small screens */}
      <button
        className={`menu-button lg:hidden transition-all duration-300 ${
          mobileMenuVisible ? "rotate-90" : ""
        }`}
        onClick={toggleMobileMenu}
      >
        {mobileMenuVisible ? <X size={30} /> : <Menu size={30} />}
      </button>

      {/* Links for desktop */}
      <div className="hidden lg:block">
        <ul className="flex gap-4">
          <li>
            <Link href="/signup">
              <button>Register</button>
            </Link>
          </li>
          <li>
            <Link href="/signin">
              <button>Sign-in</button>
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu with sliding effect */}
      <div
        className={`absolute top-14 right-0 w-48 bg-white shadow-lg rounded-md p-4 lg:hidden sub-menu transition-all duration-300 ${
          mobileMenuVisible ? "slide-down" : "slide-up"
        }`}
        style={{ visibility: mobileMenuVisible ? "visible" : "hidden" }}
      >
        <ul className="flex flex-col gap-4">
          <li>
            <Link href="/signup">
              <button onClick={() => setMobileMenuVisible(false)}>
                Register
              </button>
            </Link>
          </li>
          <li>
            <Link href="/signin">
              <button onClick={() => setMobileMenuVisible(false)}>
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
      `}</style>
    </div>
  );
}

export default Navbar;
