// import NextAuth from "next-auth";

// import arcjet, { detectBot, fixedWindow } from "@arcjet/next";
// import { NextResponse } from "next/server";
// import authOptions from "@/lib/auth";

// const handler = NextAuth(authOptions);
// // console.log("API Called");

// const aj = arcjet({
//   key: process.env.ARCJET_KEY!,
//   rules: [
//     fixedWindow({
//       mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
//       window: 60, // tracks requests across a 60 second sliding window
//       max: 3, // allow a maximum of 10 requests
//     }),
//     detectBot({
//       mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
//       allow: ["CATEGORY:SEARCH_ENGINE"],
//     }),
//   ],
// });

// const ajProtectedPOST = async (req: Request, res: Response) => {
//   // Protect with Arcjet
//   const decision = await aj.protect(req);
//   console.log("Arcjet decision", decision);

//   if (decision.isDenied()) {
//     if (decision.reason.isRateLimit()) {
//       return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
//     } else {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//     }
//   }

//   // Then call the original handler
//   return handler(req, res);
// };

// export { handler as GET, ajProtectedPOST as POST };

// // export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import arcjet, { detectBot, fixedWindow } from "@arcjet/next";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";

const handler = NextAuth(authOptions);

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    fixedWindow({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      window: 60, // tracks requests across a 60-second sliding window
      max: 3, // allow a maximum of 3 requests
    }),
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
  ],
});

const ajProtectedPOST = async (req: Request, res: Response) => {
  // Protect with Arcjet
  const decision = await aj.protect(req);
  // console.log("Arcjet decision", decision);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }

  // Then call the original handler
  return handler(req, res);
};

export { handler as GET, ajProtectedPOST as POST };
