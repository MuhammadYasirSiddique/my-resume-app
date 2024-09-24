// import { NextRequest, NextResponse } from "next/server";

// // Define the shape of the expected data using TypeScript interfaces or types
// interface RequestBody {
//   name: string;
//   email: string;
//   password: string;
// }

// export async function POST(req: NextRequest) {
//   //res: NextResponse
//   try {
//     // Parse the request body (assuming it's JSON)
//     const body: RequestBody = await req.json();

//     // Log the received data to the console
//     console.log("Data received from client:", body);

//     // Send a response back to the client
//     return NextResponse.json({
//       message: "Data logged successfully",
//       data: body,
//     });
//   } catch (error) {
//     // Handle errors (e.g., invalid JSON or data shape)
//     console.error("Error processing the request:", error);
//     return NextResponse.json(
//       { message: "Error processing the request" },
//       { status: 400 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs"; // assuming password needs to be hashed
import { sql } from "@vercel/postgres";

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();

    console.log("Data received from client:", body);

    // Perform validation and hashing of the password
    const hashedPassword = await hash(body.password, 10);

    const response = await sql`
      INSERT INTO sample_users (name, email, password)
      VALUES (${body.name}, ${body.email}, ${hashedPassword})
      RETURNING *;
    `;
    // console.log(response.rows[0]);
    return NextResponse.json({
      message: "API: - User registered successfully",
      data: response.rows[0], // Return the first inserted row

      //   data: { ...body, password: hashedPassword },
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { message: "Error processing the request" },
      { status: 400 }
    );
  }
}
