"use client";

import { useState } from "react";
import AuthLayout from "../components/auth/AuthLayout";
import TextField from "../components/ui/TextField";
import PasswordField from "../components/ui/PasswordField";
import { apiLogin } from "../../lib/api";
import { setSession } from "../../lib/session";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") || "").trim();
    const password = String(f.get("password") || "");

    setErr(null);
    if (!email || !password) return setErr("Please enter email and password.");
    try {
      setLoading(true);
      const res = await apiLogin({ email, password });
      if (res?.user?.id) {
        setSession({ id: res.user.id, name: res.user.name, email: res.user.email });
      }
      window.location.href = "/dashboard";
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome back ✨" subtitle="Log in to your LearnWAI account">
      <form onSubmit={onSubmit} className="space-y-4">
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
        <PasswordField label="Password" name="password" placeholder="••••••••" />

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
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="mt-3 flex items-center justify-between text-sm">
          <a href="/register" className="font-inter text-neutral-700 underline">
            Create an account
          </a>
          <a href="#" className="font-inter text-neutral-700 underline">
            Forgot password?
          </a>
        </div>
      </form>
    </AuthLayout>
  );
}
