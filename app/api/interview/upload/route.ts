import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Interview clips can run several minutes and easily exceed Vercel's 4.5MB
// server-upload limit, so the browser uploads directly to Vercel Blob
// storage instead of sending the file through this server function. This
// route only ever handles small JSON — issuing a short-lived, scoped
// upload token — never the actual video bytes.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["video/webm"],
        addRandomSuffix: true,
        maximumSizeInBytes: 200 * 1024 * 1024, // 200MB per clip, generous but bounded
      }),
      onUploadCompleted: async ({ blob }) => {
        // Note: this callback never fires on localhost (Vercel can't reach
        // it), only in production. We don't rely on it for anything
        // functional — the client tracks each clip's URL itself and sends
        // the full set to /api/interview/complete once the interview ends.
        console.log("Interview clip stored:", blob.url);
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload authorization failed." },
      { status: 400 }
    );
  }
}
