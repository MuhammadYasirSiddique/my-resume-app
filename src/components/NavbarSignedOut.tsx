"use client";
import Link from "next/link";
import React from "react";
// import { useSession } from "next-auth/react";

function Navbar() {
  return (
    <div className="mx-10 mt-5 flex justify-between">
      <div>
        <Link href="/">
          <button>
            <h1>My Resume</h1>
          </button>
        </Link>
      </div>
      <div>
        <ul className="flex gap-4">
          <li>
            <Link href="/signup">
              <button>Register </button>
            </Link>
          </li>
          <li>
            {" "}
            <Link href="/signin">
              <button>Sign-in </button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
