"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { upload } from "@vercel/blob/client";
import {
  Video,
  Mic,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { INTERVIEW_QUESTIONS } from "@/lib/interview-questions";

type Phase =
  | "landing"
  | "requesting"
  | "denied"
  | "countdown"
  | "recording"
  | "advancing"
  | "finishing"
  | "done"
  | "error";

const TOTAL = INTERVIEW_QUESTIONS.length;
const FRAME = "#7A1F2E"; // deep burgundy — the portal's frame/accent color

function slug(input: string) {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "candidate"
  );
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function pickMimeType() {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) {
      return c;
    }
  }
  return undefined;
}

export function InterviewClient() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(3);
  const [qIndex, setQIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [subSecondsLeft, setSubSecondsLeft] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const sessionIdRef = useRef<string>("");
  const qIndexRef = useRef(0);
  const subIndexRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advancingRef = useRef(false);
  const startedAtRef = useRef<string>("");
  const clipUrlsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    sessionIdRef.current =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    return () => {
      stopTicker();
      stopCountdownTimer();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The <video> element only exists in the DOM once phase reaches
  // "countdown" or later — re-attach the stream whenever the phase changes
  // so it always finds the currently-mounted element.
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [phase]);

  function stopTicker() {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }

  function stopCountdownTimer() {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }

  async function beginFlow() {
    if (!name.trim() || !email.trim()) return;
    setPhase("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      streamRef.current = stream;
      startedAtRef.current = new Date().toISOString();
      runCountdown(0);
    } catch {
      setPhase("denied");
    }
  }

  // Runs a fresh 3-2-1 countdown before EVERY section, not just the first.
  function runCountdown(targetIndex: number) {
    setPhase("countdown");
    setCount(3);
    let n = 3;
    stopCountdownTimer();
    countdownRef.current = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        stopCountdownTimer();
        startSection(targetIndex);
      } else {
        setCount(n);
      }
    }, 900);
  }

  function startSection(index: number) {
    const stream = streamRef.current;
    if (!stream) return;
    qIndexRef.current = index;
    setQIndex(index);
    advancingRef.current = false;

    const section = INTERVIEW_QUESTIONS[index];
    chunksRef.current = [];

    const mimeType = pickMimeType();
    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      void uploadCurrentClip(index);
    };
    recorder.start();
    setPhase("recording");

    startSubTimer(0, section);
  }

  function startSubTimer(sub: number, section = INTERVIEW_QUESTIONS[qIndexRef.current]) {
    subIndexRef.current = sub;
    setSubIndex(sub);
    const prompt = section.prompts[sub];
    let remaining = prompt.seconds;
    setSubSecondsLeft(remaining);

    stopTicker();
    tickRef.current = setInterval(() => {
      remaining -= 1;
      setSubSecondsLeft(remaining);
      if (remaining <= 0) {
        const nextSub = subIndexRef.current + 1;
        if (nextSub < section.prompts.length) {
          startSubTimer(nextSub, section);
        } else {
          goNext(); // last question in this section — wrap up the section
        }
      }
    }, 1000);
  }

  async function uploadCurrentClip(index: number) {
    const section = INTERVIEW_QUESTIONS[index];
    const fileBlob = new Blob(chunksRef.current, { type: "video/webm" });
    const pathname = `interview-submissions/${slug(name)}_${sessionIdRef.current}/${section.id}.webm`;

    try {
      const result = await upload(pathname, fileBlob, {
        access: "private",
        contentType: "video/webm",
        handleUploadUrl: "/api/interview/upload",
      });
      clipUrlsRef.current[section.id] = result.url;

      if (index + 1 < TOTAL) {
        runCountdown(index + 1); // fresh 3-2-1 before the next section
      } else {
        await finishSession();
      }
    } catch {
      setErrorMsg(
        "Couldn't save that answer — check your connection and we'll retry."
      );
      setPhase("error");
    }
  }

  function goNext() {
    if (advancingRef.current) return;
    advancingRef.current = true;
    stopTicker();
    setPhase("advancing");
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop(); // triggers onstop -> uploadCurrentClip -> next section
    }
  }

  async function finishSession() {
    setPhase("finishing");
    try {
      await fetch("/api/interview/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          candidateName: name,
          candidateEmail: email,
          clipUrls: clipUrlsRef.current,
          startedAt: startedAtRef.current,
        }),
      });
    } catch {
      // Non-fatal — clips are already saved individually in Blob storage.
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setPhase("done");
  }

  const q = INTERVIEW_QUESTIONS[qIndex];
  const progressPct = Math.round(((qIndex + (phase === "advancing" ? 1 : 0)) / TOTAL) * 100);
  const showsVideo =
    phase === "countdown" || phase === "recording" || phase === "advancing" || phase === "finishing";

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Thick top frame — doubles as the portal's title bar */}
      <header
        className="shrink-0 flex items-center justify-center h-16 sm:h-20"
        style={{ backgroundColor: FRAME }}
      >
        <span className="text-white text-lg sm:text-2xl font-bold uppercase tracking-[0.35em]">
          AI Interview
        </span>
      </header>

      {/* Thin frame around everything below the header */}
      <div
        className="flex-1 min-h-0 overflow-y-auto"
        style={{ border: `2px solid ${FRAME}`, borderTop: "none" }}
      >
        <AnimatePresence mode="wait">
          {/* LANDING */}
          {phase === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="min-h-full flex items-center justify-center px-4 py-12"
            >
              <div className="w-full max-w-xl rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-10 sm:p-12 text-center">
                <span className="text-base font-bold uppercase tracking-[0.12em] text-[#1f4e9c]">
                  GRIMOSK · Interview
                </span>
                <h1 className="mt-5 text-4xl sm:text-5xl font-medium tracking-[-0.02em] text-foreground">
                  Welcome.
                </h1>
                <p className="mt-4 text-lg text-foreground/70 leading-relaxed">
                  This is a short recorded interview — {TOTAL} sections, each
                  with a few related questions, answered one section at a
                  time. A 3-2-1 countdown runs before each section, then
                  recording starts automatically.
                </p>

                <div className="mt-8 grid gap-4 text-left">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-foreground/10 bg-foreground/[0.02] px-5 py-4 text-base text-foreground placeholder:text-foreground/50 outline-none focus:border-foreground/25"
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-xl border border-foreground/10 bg-foreground/[0.02] px-5 py-4 text-base text-foreground placeholder:text-foreground/50 outline-none focus:border-foreground/25"
                  />
                </div>

                <button
                  onClick={beginFlow}
                  disabled={!name.trim() || !email.trim()}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-medium text-[var(--background)] hover:bg-foreground/90 transition-colors press disabled:opacity-40"
                >
                  Start Interview
                  <ArrowRight className="h-5 w-5" />
                </button>
                <p className="mt-5 flex items-center justify-center gap-5 text-sm text-foreground/50">
                  <span className="inline-flex items-center gap-2">
                    <Video className="h-4 w-4" /> Camera required
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Mic className="h-4 w-4" /> Mic required
                  </span>
                </p>
              </div>
            </motion.div>
          )}

          {/* REQUESTING PERMISSION */}
          {phase === "requesting" && (
            <motion.div
              key="requesting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-full flex items-center justify-center px-4"
            >
              <div className="w-full max-w-md rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-12 text-center">
                <Loader2 className="mx-auto h-9 w-9 animate-spin text-foreground/60" />
                <p className="mt-5 text-lg text-foreground/70">
                  Waiting for camera & microphone access…
                </p>
              </div>
            </motion.div>
          )}

          {/* PERMISSION DENIED */}
          {phase === "denied" && (
            <motion.div
              key="denied"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-full flex items-center justify-center px-4"
            >
              <div className="w-full max-w-md rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-10 text-center">
                <AlertTriangle className="mx-auto h-9 w-9 text-rose-500" />
                <h2 className="mt-5 text-2xl font-semibold text-foreground">
                  Camera & mic access needed
                </h2>
                <p className="mt-3 text-foreground/65">
                  Please allow camera and microphone permissions in your
                  browser, then try again.
                </p>
                <button
                  onClick={beginFlow}
                  className="mt-7 rounded-full border border-foreground/15 px-6 py-3 text-foreground hover:bg-foreground/[0.05] transition-colors press"
                >
                  Try again
                </button>
              </div>
            </motion.div>
          )}

          {/* COUNTDOWN + RECORDING — video fills the entire left half, thin divider to the right panel */}
          {showsVideo && (
            <motion.div
              key="interview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-full flex-col lg:flex-row"
            >
              {/* Video preview */}
              <div
                className="relative h-[45vh] lg:h-auto lg:w-1/2 bg-black"
                style={{ borderBottom: `1px solid ${FRAME}` }}
              >
                <div className="hidden lg:block absolute top-0 right-0 h-full" style={{ borderRight: `1px solid ${FRAME}` }} />
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover -scale-x-100"
                />
                {phase === "countdown" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <motion.span
                      key={count}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-8xl sm:text-9xl font-semibold text-white"
                    >
                      {count}
                    </motion.span>
                  </div>
                )}
                {phase === "recording" && (
                  <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-sm font-medium text-white">REC</span>
                  </div>
                )}
              </div>

              {/* Question panel */}
              <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-16 lg:w-1/2 lg:px-20">
                {phase === "countdown" ? (
                  <p className="text-xl font-semibold text-foreground/70">
                    Get ready — recording starts in a moment.
                  </p>
                ) : phase === "finishing" ? (
                  <div className="text-center lg:text-left">
                    <Loader2 className="h-7 w-7 animate-spin text-foreground/60" />
                    <p className="mt-4 text-xl text-foreground/70">Wrapping up…</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold uppercase tracking-[0.1em] text-[#1f4e9c]">
                        Section {qIndex + 1} of {TOTAL}
                      </span>
                    </div>

                    <div className="mt-3 h-2 w-full rounded-full bg-foreground/10">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%`, backgroundColor: FRAME }}
                      />
                    </div>

                    <p className="mt-8 text-base font-bold uppercase tracking-wide text-foreground/50">
                      {q?.theme}
                    </p>

                    <div className="mt-5 space-y-5">
                      {q?.prompts.map((p, i) => {
                        const isCurrent = i === subIndex;
                        return (
                          <div key={i} className="flex items-center justify-between gap-4">
                            <span
                              className={cn(
                                "leading-snug tracking-[-0.01em] font-bold",
                                isCurrent
                                  ? "text-2xl sm:text-3xl text-foreground"
                                  : "text-base text-foreground/35"
                              )}
                            >
                              {p.text}
                            </span>
                            {isCurrent && (
                              <span
                                className="shrink-0 font-mono text-lg font-semibold"
                                style={{ color: FRAME }}
                              >
                                {fmt(subSecondsLeft)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={goNext}
                      disabled={phase === "advancing"}
                      className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-base font-medium text-[var(--background)] hover:bg-foreground/90 transition-colors press disabled:opacity-50"
                    >
                      {phase === "advancing" ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" /> Saving…
                        </>
                      ) : qIndex + 1 === TOTAL ? (
                        <>
                          Finish
                          <CheckCircle2 className="h-5 w-5" />
                        </>
                      ) : (
                        <>
                          Next section
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* DONE */}
          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-full flex items-center justify-center px-4"
            >
              <div className="w-full max-w-md rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-12 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
                <h2 className="mt-6 text-3xl font-medium text-foreground">
                  Thank you, {name.split(" ")[0]}.
                </h2>
                <p className="mt-4 text-lg text-foreground/65">
                  Your interview has been recorded and submitted. We&apos;ll be
                  in touch.
                </p>
              </div>
            </motion.div>
          )}

          {/* ERROR */}
          {phase === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-full flex items-center justify-center px-4"
            >
              <div className="w-full max-w-md rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-10 text-center">
                <AlertTriangle className="mx-auto h-9 w-9 text-rose-500" />
                <p className="mt-5 text-lg text-foreground/70">{errorMsg}</p>
                <button
                  onClick={() => uploadCurrentClip(qIndexRef.current)}
                  className="mt-7 rounded-full border border-foreground/15 px-6 py-3 text-foreground hover:bg-foreground/[0.05] transition-colors press"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
