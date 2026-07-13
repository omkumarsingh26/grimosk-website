"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "done";
type ApplyingAs = "Job" | "Internship";
type Errors = Partial<
  Record<"name" | "email" | "domains" | "message", string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DOMAINS = [
  "Strategy & Research",
  "Business Consulting",
  "Finance",
  "Marketing",
  "Technology & AI",
  "Compliance & Certifications",
  "Talent & Recruitment",
  "Operations & Execution",
] as const;

export function JobApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [sendError, setSendError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    applyingAs: "Job" as ApplyingAs,
    domains: [] as string[],
    link: "",
    message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggleDomain(d: string) {
    setForm((f) => ({
      ...f,
      domains: f.domains.includes(d)
        ? f.domains.filter((x) => x !== d)
        : [...f.domains, d],
    }));
    if (errors.domains) setErrors((e) => ({ ...e, domains: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!form.email.trim()) next.email = "We need an email to reply.";
    else if (!EMAIL_RE.test(form.email))
      next.email = "That email doesn't look right — check the format.";
    if (form.domains.length === 0)
      next.domains = "Pick at least one area you're interested in.";
    if (form.message.trim().length < 10)
      next.message = "A couple of sentences helps us place you correctly.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      const first = (["name", "email", "domains", "message"] as const).find(
        (k) => found[k]
      );
      if (first === "domains") {
        document.getElementById("domains-group")?.scrollIntoView({ block: "center" });
      } else if (first) {
        document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      }
      return;
    }
    setStatus("submitting");
    setSendError(null);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong.");
      }
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setSendError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  return (
    <div className="relative rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <h3 className="mt-5 text-xl font-semibold text-foreground">
              Thanks, {form.name.split(" ")[0] || "there"} — application received.
            </h3>
            <p className="mt-2 max-w-sm text-sm text-foreground/65">
              We&apos;ll review it against current openings and reach out if
              there&apos;s a fit.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  applyingAs: "Job",
                  domains: [],
                  link: "",
                  message: "",
                });
              }}
              className="mt-7 rounded-full border border-foreground/15 px-5 py-2 text-sm text-foreground hover:bg-foreground/[0.05] transition-colors press"
            >
              Submit another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            noValidate
            className="grid gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={errors.name}>
                <input
                  name="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Jordan Rivera"
                  aria-invalid={!!errors.name}
                  className={inputCls(!!errors.name)}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="jordan@email.com"
                  aria-invalid={!!errors.email}
                  className={inputCls(!!errors.email)}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone (optional)">
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className={inputCls(false)}
                />
              </Field>
              <Field label="LinkedIn / resume link (optional)">
                <input
                  name="link"
                  value={form.link}
                  onChange={(e) => update("link", e.target.value)}
                  placeholder="linkedin.com/in/jordan"
                  className={inputCls(false)}
                />
              </Field>
            </div>

            <Field label="Applying for">
              <div className="flex gap-3">
                {(["Job", "Internship"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update("applyingAs", opt)}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors press",
                      form.applyingAs === opt
                        ? "border-[#0f2a52] bg-[#0f2a52] text-white"
                        : "border-foreground/10 bg-foreground/[0.02] text-foreground/70 hover:bg-foreground/[0.05]"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </Field>

            <div id="domains-group">
              <span className="mb-2 block text-xs uppercase tracking-widest text-foreground/60">
                Areas of interest — select all that apply
              </span>
              <div className="flex flex-wrap gap-2">
                {DOMAINS.map((d) => {
                  const active = form.domains.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDomain(d)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-colors press",
                        active
                          ? "border-[#0f2a52] bg-[#eaf1fb] text-[#0f2a52]"
                          : "border-foreground/10 bg-foreground/[0.02] text-foreground/70 hover:bg-foreground/[0.05]"
                      )}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              {errors.domains && (
                <span role="alert" className="mt-2 block text-xs text-rose-500">
                  {errors.domains}
                </span>
              )}
            </div>

            <Field label="Why do you want to join?" error={errors.message}>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="A few lines on your background, relevant experience, and why Grimosk."
                aria-invalid={!!errors.message}
                className={cn(inputCls(!!errors.message), "resize-none")}
              />
            </Field>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-[var(--background)] hover:bg-foreground/90 transition-colors press disabled:opacity-60"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit application
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
            {sendError && (
              <p role="alert" className="text-sm text-rose-500">
                {sendError}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls = (invalid: boolean) =>
  cn(
    "w-full rounded-xl border bg-foreground/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-foreground/50 outline-none transition-colors",
    invalid
      ? "border-rose-400/60 focus:border-rose-400"
      : "border-foreground/10 focus:border-foreground/25 focus:bg-foreground/[0.04]"
  );

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-foreground/60">
        {label}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-xs text-rose-500">
          {error}
        </span>
      )}
    </label>
  );
}
