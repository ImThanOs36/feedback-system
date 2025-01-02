import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const client = new PrismaClient();

  try {
    const issues = await client.issue.findMany();

    // Add headers to the NextResponse
    const response = NextResponse.json(
      { issues },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with your frontend URL
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
