import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Reuse the Prisma Client instance to improve performance
const client = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Handle OPTIONS preflight requests
    if (req.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 200 });
      response.headers.set(
        "Access-Control-Allow-Origin",
        "http://localhost:3000"
      );
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      response.headers.set("Access-Control-Allow-Credentials", "true");
      return response;
    }

    // Fetch issues from the database
    const issues = await client.issue.findMany();

    // Create the response with the issues data
    const response = NextResponse.json({ issues }, { status: 200 });

    // Set CORS headers
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3000"
    ); // Replace with your frontend URL
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  } catch (error) {
    console.error("Critical error:", error);

    // Return a 500 response with an appropriate error message
    return NextResponse.json(
      { message: "Server error occurred." },
      { status: 500 }
    );
  }
}
