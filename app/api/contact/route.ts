import { NextResponse } from "next/server";
import { getResend, RECEIVING_EMAIL, SENDING_EMAIL } from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, company, service, message } = body as Record<
    string,
    string
  >;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const resend = getResend();
  if (!resend) {
    console.error(
      "RESEND_API_KEY is not set — see .env.local.example for setup."
    );
    return NextResponse.json(
      { error: "Email is not configured yet on the server." },
      { status: 500 }
    );
  }

  try {
    await resend.emails.send({
      from: SENDING_EMAIL,
      to: RECEIVING_EMAIL,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        company ? `Company: ${company}` : null,
        service ? `Interested in: ${service}` : null,
        "",
        "Message:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend send failed:", err);
    return NextResponse.json(
      { error: "Could not send the message. Please try again." },
      { status: 502 }
    );
  }
}
