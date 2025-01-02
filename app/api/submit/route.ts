import { NextResponse } from "next/server";
import XLSX from "xlsx";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
  const client = new PrismaClient();
  try {
    const body = await req.json();
    if (!body.formData) {
      console.error("Error: formData is missing in the request body.");
      return NextResponse.json(
        { message: "Invalid request format. formData is missing." },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      department,
      issueTitle,
      issueDescription,
      additionalInfo,
    } = body.formData;

    const priority = "Medium";
    const date = new Date();
    const indianTime = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const issue = await client.issue.create({
      data: {
        name: name || "Unknown",
        email: email || "no-email@example.com",
        department: department || "General",
        title: issueTitle || "Untitled",
        description: issueDescription || "No description provided.",
        additionalInfo: additionalInfo || "",
        priority,
        date: indianTime.toISOString(), // Use IST date here
        status: "Open",
      },
    });

    const issueData = [
      {
        id: issue.id,
        name: issue.name,
        email: issue.email,
        department: issue.department,
        Title: issue.title,
        Description: issue.description,
        additionalInfo: issue.additionalInfo,
        priority,
        date,
        status: "Open",
      },
    ];

    const newWorksheet = XLSX.utils.json_to_sheet(issueData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Issues");

    const buffer = XLSX.write(newWorkbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    if (!buffer || buffer.length === 0) {
      console.error("Error: Generated Excel buffer is empty or null.");
      return NextResponse.json(
        { message: "Failed to generate Excel file." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "82b37e001@smtp-brevo.com",
        pass: "vfGawDUbcsO24Ngq",
      },
    });

    const info = await transporter.sendMail({
      from: '"Shubham Lad" <lads42279@gmail.com>',
      to: "ladramjay1528@gmail.com",
      subject: "Issue Report",
      text: `Hello,

Please find the attached issue report for your reference.

If you have any questions or need further information, feel free to reach out to me.

Best regards,
Shubham Lad
<lads42279@gmail.com>`,
      attachments: [
        {
          filename: "issues.xlsx",
          content: buffer,
          encoding: "base64",
        },
      ],
    });

    console.log("Message sent: %s", info.messageId);

    // Send response to client, informing that the email was sent successfully
    return NextResponse.json(
      {
        message:
          "The issue has been received and the report has been sent to the concerned team via email.",
        status: "success",
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
