import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index"; // Replace with your Drizzle DB import
import { passwordResets, users } from "@/db/schema"; // Replace with your user schema import
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";

// // POST request to handle password reset
// export async function POST(req: NextRequest, res: NextResponse) {
//   console.log(res);
//   try {
//     const { password, userid, token } = await req.json();
//     // console.log(userid);
//     // Validate request
//     if (!password || !userid || !token) {
//       return NextResponse.json(
//         { error: "Missing parameters" },
//         { status: 400 }
//       );
//     }

//     // Verify token (you would implement token verification logic here)
//     const isTokenValid = await verifyToken(token, userid); // Implement this function

//     if (!isTokenValid) {
//       return NextResponse.json(
//         { error: "Invalid or expired token" },
//         { status: 401 }
//       );
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Update the password in the database using Drizzle
//     await db
//       .update(users)
//       .set({ password: hashedPassword, updatedAt: new Date() })
//       .where(eq(users.id, userid)); // Replace with your actual user ID column

//     await db
//       .update(passwordResets)
//       .set({ tokenUsed: true })
//       .where(
//         and(eq(passwordResets.userId, userid), eq(passwordResets.token, token))
//       );

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error resetting password:", error);
//     return NextResponse.json(
//       { error: "Failed to reset password" },
//       { status: 500 }
//     );
//   }
// }

// // Function to verify the token (you'll need to implement this logic based on your token system)
// async function verifyToken(token: string, userid: string) {
//   // console.log(userid);
//   try {
//     const resetRecord = await db
//       .select()
//       .from(passwordResets)
//       .where(
//         and(eq(passwordResets.userId, userid), eq(passwordResets.token, token))
//       )
//       .execute();
//     // console.log(resetRecord);
//     if (resetRecord.length === 0) {
//       // console.log("Invalid token or user ID");
//       return NextResponse.json(
//         { error: "Invalid token or user ID" },
//         { status: 401 }
//       );
//     }

//     // Check if the token is expired
//     const resetData = resetRecord[0];
//     const currentTime = new Date();

//     if (!resetData.expiresAt || resetData.expiresAt < currentTime) {
//       console.log(" Token has expired");
//       return NextResponse.json({ error: "Token has expired" }, { status: 401 });
//     }

//     if (resetData.tokenUsed) {
//       return NextResponse.json(
//         { error: "Token is already used" },
//         { status: 401 }
//       );
//     }
//     return true; // Token is valid and not expired
//   } catch (error) {
//     console.log(error);
//   }
//   return false;
// }

export async function POST(req: NextRequest) {
  try {
    const { password, userid, token } = await req.json();

    // Validate request
    if (!password || !userid || !token) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Verify token
    const tokenStatus = await verifyToken(token, userid);

    // Handle token verification result
    if (tokenStatus === "invalid") {
      return NextResponse.json(
        { error: "Invalid token or user ID" },
        { status: 401 }
      );
    } else if (tokenStatus === "expired") {
      return NextResponse.json({ error: "Token has expired" }, { status: 401 });
    } else if (tokenStatus === "used") {
      return NextResponse.json(
        { error: "Token is already used" },
        { status: 401 }
      );
    } else if (tokenStatus === "error") {
      return NextResponse.json(
        { error: "Error verifying token" },
        { status: 500 }
      );
    }

    // If token is valid, proceed with password reset
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userid)); // Replace with actual user ID column

    // Mark token as used
    await db
      .update(passwordResets)
      .set({ tokenUsed: true })
      .where(
        and(eq(passwordResets.userId, userid), eq(passwordResets.token, token))
      );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}

async function verifyToken(token: string, userid: string) {
  try {
    const resetRecord = await db
      .select()
      .from(passwordResets)
      .where(
        and(eq(passwordResets.userId, userid), eq(passwordResets.token, token))
      )
      .execute();

    if (resetRecord.length === 0) {
      return "invalid"; // Return invalid token or user ID
    }

    const resetData = resetRecord[0];
    const currentTime = new Date();

    if (!resetData.expiresAt || resetData.expiresAt < currentTime) {
      return "expired"; // Return expired token
    }

    if (resetData.tokenUsed) {
      return "used"; // Return already used token
    }

    return true; // Token is valid
  } catch (error) {
    console.log("Error verifying token:", error);
    return "error"; // Return generic error
  }
}
