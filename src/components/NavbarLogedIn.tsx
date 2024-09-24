// "use client";
// import { signOut, useSession } from "next-auth/react";
// import Link from "next/link";
// import React from "react";
// import Image from "next/image";

// function NavbarLogin() {
//   const { data: session } = useSession();
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
//         <Image
//           // src={session?.user.image}
//           src={"/profileimg.png"}
//           height={80}
//           width={80}
//           alt="Profile Image"
//           className="rounded-full mb-4 shadow-md"
//         />
//       </div>
//       <h2 className="">Welcome, {session?.user?.name}!</h2>
//       <p className=""> {session?.user?.email} </p>

//       <div>
//         <ul className="flex gap-4">
//           <li>
//             {" "}
//             {/* <Link> */}
//             <button onClick={() => signOut()}>Sign-Out </button>
//             {/* </Link> */}
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default NavbarLogin;

"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

function NavbarLogin() {
  const { data: session } = useSession();
  const [menuVisible, setMenuVisible] = useState(false);

  // Function to toggle the visibility of the sub-menu
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div className="mx-10 mt-5 flex justify-between items-center">
      <div>
        <Link href="/">
          <button>
            <h1>My Resume</h1>
          </button>
        </Link>
      </div>

      <div className="relative">
        {/* Profile Image Button */}
        <button onClick={toggleMenu}>
          <Image
            src={session?.user?.image || "/profileimg.png"}
            height={50}
            width={50}
            alt="Profile Image"
            className="rounded-full shadow-md cursor-pointer"
          />
        </button>

        {/* Sub-menu (Dropdown) */}
        {menuVisible && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-4">
            <div className="flex items-center mb-4">
              <Image
                src={session?.user?.image || "/profileimg.png"}
                height={40}
                width={40}
                alt="Profile Image"
                className="rounded-full"
              />
              <div className="ml-2">
                <h2 className="text-sm font-semibold">
                  {session?.user?.name || "Guest User"}
                </h2>
                <p className="text-xs text-gray-500">
                  {session?.user?.email || "guest@example.com"}
                </p>
              </div>
            </div>
            <hr />
            <div className="my-4">
              <Link href="/dashboard">
                <button>
                  <p className="text-md text-gray-500">Dashboard</p>
                </button>
              </Link>
            </div>
            {/* Logout Button */}
            <button
              onClick={() => signOut()}
              className="mt-2 w-full bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavbarLogin;
