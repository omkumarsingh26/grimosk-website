import { NextResponse } from "next/server";
import { getResend, RECEIVING_EMAIL, SENDING_EMAIL } from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, phone, applyingAs, domains, link, message } =
    body as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof message !== "string" ||
    !message.trim() ||
    !Array.isArray(domains) ||
    domains.length === 0
  ) {
    return NextResponse.json(
      { error: "Name, email, at least one domain, and a message are required." },
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
      subject: `New ${applyingAs || "Job"} application from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        `Applying for: ${applyingAs || "Job"}`,
        `Areas of interest: ${domains.join(", ")}`,
        link ? `Link: ${link}` : null,
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
      { error: "Could not send the application. Please try again." },
      { status: 502 }
    );
  }
}
