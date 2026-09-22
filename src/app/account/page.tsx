"use client";

import { useState } from "react";
import { useMembership } from "@/lib/membership";

export default function ProfilePage() {
  const { member, updateProfile, updatePassword, signOut } = useMembership();
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(member?.firstName ?? "");
  const [lastName, setLastName] = useState(member?.lastName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [marketingEmail, setMarketingEmail] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  if (!member) return null;

  const displayFirstName = member.firstName || member.email;
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(" ");

  const handleSave = async () => {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    if (!trimmedFirst || !trimmedLast) return;
    const { error: updateError } = await updateProfile({
      firstName: trimmedFirst,
      lastName: trimmedLast,
    });
    if (updateError) {
      setError(updateError);
      return;
    }
    setError(null);
    setEditing(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don’t match.");
      return;
    }

    setPasswordSaving(true);
    const { error: updateError } = await updatePassword({ currentPassword, newPassword });
    setPasswordSaving(false);

    if (updateError) {
      setPasswordError(updateError);
      return;
    }

    setPasswordError(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setChangingPassword(false);
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  return (
    <div>
      <div className="rounded-sm border border-ink-line bg-paper px-6 py-3.5">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg text-ink">Hi, {displayFirstName}</p>
          <button
            onClick={() => void signOut()}
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 transition hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-10 flex items-baseline justify-between">
        <p className="font-display text-xl text-ink">{fullName || member.email}</p>
        <button
          onClick={() => {
            setFirstName(member.firstName);
            setLastName(member.lastName);
            setError(null);
            setEditing((prev) => !prev);
          }}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep underline underline-offset-4"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {editing ? (
        <div className="mt-3 space-y-3 rounded-sm border border-ink-line bg-paper p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                First name
              </label>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="mt-1.5 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                Last name
              </label>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="mt-1.5 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
          </div>
          {error && (
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-red-700">
              {error}
            </p>
          )}
          <button
            onClick={() => void handleSave()}
            className="rounded-full bg-ink px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between rounded-sm border border-ink-line bg-paper px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft/70">
            Email
          </p>
          <p className="text-sm text-ink">{member.email}</p>
        </div>
      )}

      <div className="mt-10 flex items-baseline justify-between">
        <p className="font-display text-xl text-ink">Password</p>
        <button
          onClick={() => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError(null);
            setChangingPassword((prev) => !prev);
          }}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep underline underline-offset-4"
        >
          {changingPassword ? "Cancel" : "Change"}
        </button>
      </div>

      {changingPassword ? (
        <div className="mt-3 space-y-3 rounded-sm border border-ink-line bg-paper p-5">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="mt-1.5 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="mt-1.5 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-1.5 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
          </div>
          {passwordError && (
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-red-700">
              {passwordError}
            </p>
          )}
          <button
            onClick={() => void handleChangePassword()}
            disabled={passwordSaving}
            className="rounded-full bg-ink px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {passwordSaving ? "Saving…" : "Save"}
          </button>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between rounded-sm border border-ink-line bg-paper px-5 py-4">
          <p className="text-sm text-ink">
            {passwordSaved ? "Password updated." : "••••••••"}
          </p>
        </div>
      )}

      <div className="mt-10 flex items-baseline justify-between">
        <p className="font-display text-xl text-ink">Addresses</p>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft/50">
          Add
        </span>
      </div>
      <div className="mt-3 rounded-sm border border-ink-line bg-paper px-5 py-6 text-sm text-ink-soft">
        No addresses added
      </div>

      <div className="mt-10 flex items-baseline justify-between">
        <p className="font-display text-xl text-ink">Payment Methods</p>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft/50">
          Add
        </span>
      </div>
      <div className="mt-3 rounded-sm border border-ink-line bg-paper px-5 py-6 text-sm text-ink-soft">
        No payment methods added
      </div>

      <div className="mt-10">
        <p className="font-display text-xl text-ink">Marketing Preferences</p>
        <div className="mt-3 flex items-center justify-between rounded-sm border border-ink-line bg-paper px-5 py-4">
          <p className="text-sm text-ink">Email me about new arrivals & events</p>
          <button
            role="switch"
            aria-checked={marketingEmail}
            onClick={() => setMarketingEmail((prev) => !prev)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              marketingEmail ? "bg-citrus-deep" : "bg-ink-line"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-cream transition-transform ${
                marketingEmail ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft/70">
        Addresses, payment methods, and billing are not yet connected — this is a demo
        account only.
      </p>
    </div>
  );
}
