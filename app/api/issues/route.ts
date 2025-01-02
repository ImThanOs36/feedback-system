import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const client = new PrismaClient();

  try {
    const issues = await client.issue.findMany();
    // Send response to client, informing that the email was sent successfully
    return NextResponse.json(
      {
        issues: issues,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Critical error:", error);
    return NextResponse.json(
      { message: "Server error occurred." },
      { status: 500 }
    );
  }
}
