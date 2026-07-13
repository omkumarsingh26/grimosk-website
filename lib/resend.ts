import { Resend } from "resend";

// Lazily created so the app doesn't crash at build time if the key isn't
// set yet — the API routes check for this and return a clear error instead.
export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// Where form submissions land. Override with RECEIVING_EMAIL in .env.local
// if you ever want them going somewhere other than om@grimosk.com.
export const RECEIVING_EMAIL = process.env.RECEIVING_EMAIL || "om@grimosk.com";

// Resend requires a verified sending domain for a "from" address at your
// own domain. Until grimosk.com is verified in Resend, we send from their
// shared test address and put the real submitter in reply-to instead —
// so hitting "Reply" in your inbox goes straight to them.
export const SENDING_EMAIL = "Grimosk Website <onboarding@resend.dev>";
