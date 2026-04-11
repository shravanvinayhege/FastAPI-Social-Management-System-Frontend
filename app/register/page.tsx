"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../components/ThemeToggle";
import { getToken, login, registerUser } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (getToken()) {
      router.replace("/");
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await registerUser(email, password);
      await login(email, password);
      setMessage("Account created and logged in successfully. Redirecting...");
      router.push("/");
    } catch (submitError) {
      const errorMessage =
        submitError instanceof Error ? submitError.message : "Unable to create account.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.2),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.2),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.2),transparent_40%)]" />

      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <section className="vf-card relative w-full max-w-md rounded-[2rem] p-8">
        <p className="text-xs uppercase tracking-[0.45em] text-cyan-300">VoteFlow</p>
        <h1 className="mt-3 font-[var(--font-space-grotesk)] text-3xl font-semibold tracking-tight text-white">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-200/80">Join the community and start posting.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-100">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-100">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a strong password"
              required
              className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="vf-btn-primary w-full px-4 py-3 text-sm transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {message}
          </p>
        ) : null}

        <p className="mt-4 text-sm text-slate-300">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-cyan-300 hover:text-cyan-200">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
