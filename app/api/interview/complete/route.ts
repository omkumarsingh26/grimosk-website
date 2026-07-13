import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

function safeSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "candidate";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { sessionId, candidateName, candidateEmail, clipUrls, startedAt } =
    body as Record<string, unknown>;

  if (typeof sessionId !== "string" || typeof candidateName !== "string") {
    return NextResponse.json(
      { error: "Missing sessionId or candidateName." },
      { status: 400 }
    );
  }

  const meta = {
    sessionId,
    candidateName,
    candidateEmail: candidateEmail || null,
    clips: clipUrls || {}, // { q1: "https://...blob url...", q2: "...", ... }
    startedAt: startedAt || null,
    completedAt: new Date().toISOString(),
  };

  try {
    // A small JSON file is well under the server-upload size limit, so a
    // normal server-side put() (not the client-upload flow) is fine here.
    await put(
      `interview-submissions/${safeSlug(candidateName)}_${sessionId}/meta.json`,
      JSON.stringify(meta, null, 2),
      {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
      }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Interview session finalize failed:", err);
    return NextResponse.json(
      { error: "Could not finalize the session." },
      { status: 502 }
    );
  }
}
