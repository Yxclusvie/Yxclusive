"use client";

import Image from "next/image";
import { useState } from "react";
import { useMembership } from "@/lib/membership";

const FEATURES = [
  "Keep 95% of every sale — the 5% commission covers transaction fees and others.",
  "Invited to the latest events & activations.",
];

type Mode = "signIn" | "signUp" | "forgotPassword";

export default function MembershipPage() {
  const {
    isMember,
    isLoaded,
    member,
    signUpWithPassword,
    signInWithPassword,
    resetPasswordForEmail,
    signOut,
  } = useMembership();

  const [mode, setMode] = useState<Mode>("signIn");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const isSignedIn = isLoaded && member !== null;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirst || !trimmedLast) {
      setError("Enter your first and last name.");
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const { error: signUpError, needsConfirmation: pendingConfirmation } = await signUpWithPassword({
      firstName: trimmedFirst,
      lastName: trimmedLast,
      email: trimmedEmail,
      password,
    });

    if (signUpError) {
      setError(signUpError);
      setSubmitting(false);
      return;
    }

    if (pendingConfirmation) {
      setNeedsConfirmation(true);
    }

    setSubmitting(false);
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!emailPattern.test(trimmedEmail) || !password) {
      setError("Enter your email and password.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const { error: signInError } = await signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (signInError) {
      setError(signInError);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  const handleCheckout = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/checkout", { method: "POST" });
      const data = await response.json();

      if (!response.ok || !data.url) {
        setError(data.error ?? "Something went wrong starting checkout.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Something went wrong starting checkout.");
      setSubmitting(false);
    }
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setError(null);
    setPassword("");
    setNeedsConfirmation(false);
    setResetSent(false);
  };

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!emailPattern.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const { error: resetError } = await resetPasswordForEmail(trimmedEmail);

    if (resetError) {
      setError(resetError);
      setSubmitting(false);
      return;
    }

    setResetSent(true);
    setSubmitting(false);
  };

  return (
    <div className="bg-citrus">
    <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-24 sm:px-10 sm:pb-24 lg:pl-36 lg:pr-32 lg:pt-8">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch lg:gap-16">
        <div className="relative w-full overflow-hidden rounded-sm border border-ink-line bg-paper">
          <div className="relative aspect-[4/5] w-full lg:h-full lg:aspect-auto">
            <Image
              src="/membership-hero-bags.jpg"
              alt="A collection of designer bags and accessories laid out, ready for their next owner"
              fill
              sizes="(max-width: 1024px) 90vw, 55vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-citrus-deep">
            Membership
          </p>
          <h1 className="mt-2 font-display text-xl leading-[1.15] text-ink sm:text-2xl">
            Ready for your piece to have a new life? Become a Yxmember and pass your piece to
            its next journey.
          </h1>

          {isSignedIn && member && (
            <div className="mt-4 flex items-center justify-between rounded-sm border border-ink/40 bg-paper px-4 py-3">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                {isMember
                  ? `You're a Yxmember, ${member.firstName || member.email} — selling is unlocked.`
                  : `Signed in as ${member.email}`}
              </p>
              <button
                onClick={() => void signOut()}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 transition hover:text-ink"
              >
                Sign out
              </button>
            </div>
          )}

          <div className="mt-5 rounded-sm border-2 border-ink bg-paper">
            <div className="border-b-2 border-ink px-5 py-3">
              <p className="font-marker text-xl text-ink">Yxmember</p>
            </div>
            <div className="px-5 py-4">
              <p className="flex items-baseline gap-1">
                <span className="font-display text-3xl text-ink">$20</span>
                <span className="font-mono text-xs text-ink-soft">/ month</span>
              </p>

              <ul className="mt-4 space-y-2">
                {FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2 text-xs leading-relaxed text-ink-soft"
                  >
                    <span className="text-citrus-deep">—</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {isMember ? (
                <button
                  disabled
                  className="mt-5 w-full cursor-not-allowed rounded-full bg-ink py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream opacity-40"
                >
                  Already a Yxmember
                </button>
              ) : isSignedIn ? (
                <div className="mt-5 border-t border-ink-line pt-4">
                  {error && (
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-red-700">
                      {error}
                    </p>
                  )}
                  <button
                    onClick={handleCheckout}
                    disabled={submitting}
                    className="w-full rounded-full bg-ink py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Redirecting to Checkout…" : "Become a Yxmember"}
                  </button>
                </div>
              ) : (
                <div className="mt-5 border-t border-ink-line pt-4">
                  <div className="flex gap-1 font-mono text-[11px] uppercase tracking-[0.12em]">
                    <button
                      type="button"
                      onClick={() => switchMode("signIn")}
                      className={`rounded-full px-3 py-1.5 transition ${
                        mode === "signIn" ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode("signUp")}
                      className={`rounded-full px-3 py-1.5 transition ${
                        mode === "signUp" ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  {mode === "signUp" && needsConfirmation ? (
                    <div className="mt-3">
                      <p className="text-xs leading-relaxed text-ink">
                        Check <span className="font-medium">{email.trim()}</span> for a
                        confirmation link — click it, then come back and sign in.
                      </p>
                      <button
                        onClick={() => switchMode("signIn")}
                        className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep underline underline-offset-4"
                      >
                        Go to sign in
                      </button>
                    </div>
                  ) : mode === "forgotPassword" ? (
                    resetSent ? (
                      <div className="mt-3">
                        <p className="text-xs leading-relaxed text-ink">
                          Check <span className="font-medium">{email.trim()}</span> for a link to
                          reset your password.
                        </p>
                        <button
                          onClick={() => switchMode("signIn")}
                          className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep underline underline-offset-4"
                        >
                          Go to sign in
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleForgotPassword} className="mt-3 space-y-2.5">
                        <p className="text-xs leading-relaxed text-ink-soft">
                          Enter your email and we&rsquo;ll send you a link to reset your
                          password.
                        </p>
                        <Field label="Email" htmlFor="forgot-email">
                          <input
                            id="forgot-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="jordan@example.com"
                            className={inputClass}
                          />
                        </Field>

                        {error && <ErrorText>{error}</ErrorText>}

                        <SubmitButton submitting={submitting}>
                          {submitting ? "Sending…" : "Send Reset Link"}
                        </SubmitButton>

                        <button
                          type="button"
                          onClick={() => switchMode("signIn")}
                          className="w-full font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4"
                        >
                          Back to sign in
                        </button>
                      </form>
                    )
                  ) : mode === "signIn" ? (
                    <form onSubmit={handleSignIn} className="mt-3 space-y-2.5">
                      <Field label="Email" htmlFor="email">
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="jordan@example.com"
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Password" htmlFor="password">
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="••••••••"
                          className={inputClass}
                        />
                      </Field>

                      <button
                        type="button"
                        onClick={() => switchMode("forgotPassword")}
                        className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4"
                      >
                        Forgot password?
                      </button>

                      {error && <ErrorText>{error}</ErrorText>}

                      <SubmitButton submitting={submitting}>
                        {submitting ? "Signing In…" : "Sign In"}
                      </SubmitButton>
                    </form>
                  ) : (
                    <form onSubmit={handleSignUp} className="mt-3 space-y-2.5">
                      <div className="grid grid-cols-2 gap-2.5">
                        <Field label="First name" htmlFor="first-name">
                          <input
                            id="first-name"
                            type="text"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            placeholder="Jordan"
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Last name" htmlFor="last-name">
                          <input
                            id="last-name"
                            type="text"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            placeholder="Reyes"
                            className={inputClass}
                          />
                        </Field>
                      </div>
                      <Field label="Email" htmlFor="new-email">
                        <input
                          id="new-email"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="jordan@example.com"
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Password" htmlFor="new-password">
                        <input
                          id="new-password"
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="At least 8 characters"
                          className={inputClass}
                        />
                      </Field>

                      {error && <ErrorText>{error}</ErrorText>}

                      <SubmitButton submitting={submitting}>
                        {submitting ? "Creating Account…" : "Create Account"}
                      </SubmitButton>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft/70">
            {isSignedIn
              ? "You'll be redirected to Stripe to complete payment securely."
              : "Your account, secured with an email and password."}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-sm border border-ink-line bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-ink";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-red-700">{children}</p>
  );
}

function SubmitButton({
  submitting,
  children,
}: {
  submitting: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="w-full rounded-full bg-ink py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}
