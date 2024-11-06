"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast
import { Menu, X } from "lucide-react"; // Importing icons from lucide-react
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

function NavbarLogin() {
  const { data: session } = useSession();
  const [menuVisible, setMenuVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // Function to toggle the visibility of the sub-menu
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Function to toggle the mobile menu visibility
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  // Close sub-menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".menu-button") && !target.closest(".sub-menu")) {
        setMenuVisible(false);
        setMobileMenuVisible(false); // Close mobile menu on click outside
      }
    };

    if (menuVisible || mobileMenuVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuVisible, mobileMenuVisible]);

  // Function to handle sign out with react-hot-toast
  const handleSignOut = () => {
    toast.promise(
      signOut({ redirect: true, callbackUrl: "/" }).then(() => {
        setMenuVisible(false);
        setMobileMenuVisible(false);
      }),
      {
        loading: "Logging out...",
        success: "Logged out successfully!",
        error: "Error logging out!",
      },
      {
        duration: 3000,
        style: {
          fontSize: "16px",
          borderRadius: "8px",
          backgroundColor: "#1f2937", // Custom background color
          color: "#fff", // Custom text color
        },
      }
    );
  };

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
        className={`menu-button text-white lg:hidden transition-all duration-300 ${
          mobileMenuVisible ? "rotate-90" : ""
        }`}
        onClick={toggleMobileMenu}
      >
        {mobileMenuVisible ? <X size={30} /> : <Menu size={30} />}
      </button>

      {/* Profile Image and Submenu */}
      <div className="relative hidden lg:block z-50 bg-amber-50">
        <div className="flex justify-center items-center text-center text-base text-white">
          <div className="mr-2">
            <p>Welcome, {session?.user?.name}!</p>
          </div>

          {/* Profile Image Button */}
          <div>
            <button
              className="menu-button hover:scale-105"
              onClick={toggleMenu}
            >
              <Image
                src={session?.user?.image || "/profileimg.png"}
                height={50}
                width={50}
                alt="Profile Image"
                className="rounded-full shadow-md cursor-pointer"
              />
            </button>
          </div>
        </div>
        {/* Sub-menu (Dropdown) */}
        <div
          className={`sub-menu absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-md p-4 slide-menu ${
            menuVisible ? "open" : ""
          }`}
        >
          <div className="flex items-center mb-4">
            <Image
              src={session?.user?.image || "/profileimg.png"}
              height={40}
              width={40}
              alt="Profile Image"
              className="rounded-full"
            />
            <div className="ml-2">
              <h2 className="text-sm font-semibold">{session?.user?.name}</h2>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
          </div>
          <hr />
          <div className="mt-2 hover:bg-slate-100">
            <Link href="/auth/reset-password">
              <button onClick={() => setMenuVisible(false)}>
                <p className="text-sm text-gray-500 ">Reset Password</p>
              </button>
            </Link>
          </div>
          <div className="hover:bg-slate-100">
            <Link href="/dashboard">
              <button onClick={() => setMenuVisible(false)}>
                <p className="text-sm text-gray-500 ">Dashboard</p>
              </button>
            </Link>
          </div>
          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="mt-2 w-full bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-14 z-50 right-10 w-52 bg-white shadow-lg rounded-md p-4 lg:hidden sub-menu slide-menu ${
          mobileMenuVisible ? "open" : ""
        }`}
      >
        <div className="flex items-center mb-4">
          <Image
            src={session?.user?.image || "/profileimg.png"}
            height={40}
            width={40}
            alt="Profile Image"
            className="rounded-full"
          />
          <div className="ml-2">
            <h2 className="text-sm font-semibold">{session?.user?.name}</h2>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
        </div>
        <hr />
        <div className="mt-2">
          <Link href="/auth/reset-password">
            <button onClick={() => setMenuVisible(false)}>
              <p className="text-sm text-gray-500">Reset Password</p>
            </button>
          </Link>
        </div>
        <div className="">
          <Link href="/dashboard">
            <button onClick={() => setMobileMenuVisible(false)}>
              <p className="text-md text-gray-500">Dashboard</p>
            </button>
          </Link>
        </div>
        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          className="mt-2 w-full bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
        >
          Sign out
        </button>
      </div>

      {/* Add styles for the sliding effect */}
      <style jsx>{`
        .slide-menu {
          transition: all 0.3s ease-in-out;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
        }

        .slide-menu.open {
          max-height: 500px; /* Adjust as necessary */
          opacity: 1;
        }
      `}</style>

      {/* Toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default NavbarLogin;
