"use client";

import { useState } from "react";
import AuthLayout from "../components/auth/AuthLayout";
import TextField from "../components/ui/TextField";
import PasswordField from "../components/ui/PasswordField";
import { apiRegister } from "../../lib/api";
import { setSession } from "../../lib/session";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const email = String(f.get("email") || "").trim();
    const password = String(f.get("password") || "");
    const confirm = String(f.get("confirm") || "");

    setErr(null);
    if (!name || !email || !password) return setErr("Please complete all fields.");
    if (password.length < 8) return setErr("Password must be at least 8 characters.");
    if (password !== confirm) return setErr("Passwords do not match.");

    try {
      setLoading(true);
      const res = await apiRegister({ name, email, password });
      if (res?.user?.id) {
        setSession({ id: res.user.id, name: res.user.name, email: res.user.email });
      }
      window.location.href = "/dashboard";
    } catch (e: any) {
      setErr(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join LearnWAI and study smarter">
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField
          label="Full name"
          name="name"
          placeholder="Jane Doe"
          iconLeft={
            <svg width="18" height="18" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" fill="none" stroke="#7C7C7C" strokeWidth="2" />
              <path d="M4 20c2-4 14-4 16 0" fill="none" stroke="#7C7C7C" strokeWidth="2" />
            </svg>
          }
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          iconLeft={
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M4 6h16v12H4z" fill="none" stroke="#7C7C7C" strokeWidth="2" />
              <path d="M4 6l8 6 8-6" fill="none" stroke="#7C7C7C" strokeWidth="2" />
            </svg>
          }
        />
        <PasswordField label="Password" name="password" placeholder="At least 8 characters" />
        <PasswordField label="Confirm password" name="confirm" placeholder="Repeat password" />

        {err ? <div className="rounded-lg bg-red-50 p-3 text-red-700">{err}</div> : null}

        <button
          type="submit"
          disabled={loading}
          className={[
            "w-full rounded-2xl px-6 py-3 font-inter font-medium text-black",
            "bg-gradient-to-r from-[#FFB468] to-[#FFD270]",
            loading ? "opacity-70" : "hover:brightness-105 active:translate-y-px",
          ].join(" ")}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="mt-3 text-center">
          <a href="/login" className="font-inter text-sm text-neutral-700 underline">
            Already have an account? Sign in
          </a>
        </div>
      </form>
    </AuthLayout>
  );
}
