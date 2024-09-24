"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

function NavbarLogin() {
  const { data: session } = useSession();
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
        <Image
          // src={session?.user.image}
          src={"/profileimg.png"}
          height={80}
          width={80}
          alt="Profile Image"
          className="rounded-full mb-4 shadow-md"
        />
      </div>
      <h2 className="">Welcome, {session?.user?.name}!</h2>
      <p className=""> {session?.user?.email} </p>

      <div>
        <ul className="flex gap-4">
          <li>
            {" "}
            {/* <Link> */}
            <button onClick={() => signOut()}>Sign-Out </button>
            {/* </Link> */}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavbarLogin;
