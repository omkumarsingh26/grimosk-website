"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { services } from "@/lib/site";

type Status = "idle" | "submitting" | "done";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [sendError, setSendError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: services[0].short,
    message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    // Clear a field's error as soon as the user corrects it.
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!form.email.trim()) next.email = "We need an email to reply.";
    else if (!EMAIL_RE.test(form.email))
      next.email = "That email doesn't look right — check the format.";
    if (form.message.trim().length < 10)
      next.message = "A sentence or two helps us scope it properly.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      // Focus the first field with an error.
      const first = (["name", "email", "message"] as const).find((k) => found[k]);
      if (first)
        document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("submitting");
    setSendError(null);
    try {
      const res = await fetch("/api/contact", {
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
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            <h3 className="mt-5 text-xl font-semibold text-foreground">
              Thanks, {form.name.split(" ")[0] || "there"} — message received.
            </h3>
            <p className="mt-2 max-w-sm text-sm text-foreground/65">
              An analyst will get back to you within one business day to scope
              your request.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setForm({
                  name: "",
                  email: "",
                  company: "",
                  service: services[0].short,
                  message: "",
                });
              }}
              className="mt-7 rounded-full border border-foreground/15 px-5 py-2 text-sm text-foreground hover:bg-foreground/[0.05] transition-colors press"
            >
              Send another
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
              <Field label="Work email" error={errors.email}>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="jordan@company.com"
                  aria-invalid={!!errors.email}
                  className={inputCls(!!errors.email)}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Company">
                <input
                  name="company"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="Acme Capital"
                  className={inputCls(false)}
                />
              </Field>
              <Field label="Interested in">
                <select
                  name="service"
                  value={form.service}
                  onChange={(e) => update("service", e.target.value)}
                  className={cn(inputCls(false), "appearance-none")}
                >
                  {services.map((s) => (
                    <option key={s.slug} value={s.short} className="bg-[#0a0a0a]">
                      {s.short}
                    </option>
                  ))}
                  <option value="Not sure yet" className="bg-[#0a0a0a]">
                    Not sure yet
                  </option>
                </select>
              </Field>
            </div>

            <Field label="What are you trying to decide?" error={errors.message}>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="A few lines on the question, the timeline, and what success looks like."
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
                  Sending…
                </>
              ) : (
                <>
                  Send message
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
        <span role="alert" className="mt-1.5 block text-xs text-rose-300">
          {error}
        </span>
      )}
    </label>
  );
}
