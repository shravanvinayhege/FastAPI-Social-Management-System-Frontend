"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "../components/ThemeToggle";
import { getToken, login } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
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
    setToken("");

    try {
      const data = await login(email, password);
      setToken(data.access_token);
      router.push("/");
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unexpected error during login.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return null;
  }

  return (
    <main className="vf-login-shell relative min-h-screen overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.18),transparent_40%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.22),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.2),transparent_40%)]" />

      <header className="vf-login-topbar relative z-10 mx-auto mb-8 flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <span className="vf-login-symbol inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-200">
            <svg
              viewBox="0 0 24 24"
              className="vf-login-symbol-mark h-5 w-5"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 16.5L12 5l8 11.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12.5l3 4 3-4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="vf-login-brand text-sm font-semibold tracking-tight text-white">VoteFlow</p>
            <p className="vf-login-subbrand text-xs text-slate-300">Smart Voting Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a href="#about" className="vf-btn-secondary px-3 py-2 text-xs sm:text-sm">
            About
          </a>
          <a
            href="https://fastapi-management-system.onrender.com/docs"
            target="_blank"
            rel="noreferrer"
            className="vf-btn-secondary px-3 py-2 text-xs sm:text-sm"
          >
            Help
          </a>
          <Link href="/register" className="vf-btn-primary px-3 py-2 text-xs sm:text-sm">
            Register
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className="vf-card relative block h-44 overflow-hidden rounded-[2rem] p-6 sm:h-56 lg:h-[34rem] lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_82%_16%,rgba(16,185,129,0.14),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.2),transparent_50%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Secure Access</p>
              <h2 className="mt-3 font-[var(--font-space-grotesk)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Welcome to VoteFlow
              </h2>
              <p className="vf-login-left-description mt-3 max-w-md text-sm leading-6 text-slate-200">
                Sign in to publish posts, vote on community content, and manage your personal feed.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Auth</p>
                <p className="mt-1 text-sm font-medium text-white">JWT protected</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Feed</p>
                <p className="mt-1 text-sm font-medium text-white">Create and vote</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Profile</p>
                <p className="mt-1 text-sm font-medium text-white">Manage your posts</p>
              </div>
            </div>
          </div>
        </section>

        <section className="vf-card relative w-full rounded-[2rem] p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.45em] text-emerald-300">Welcome Back</p>
            <h1 className="mt-3 font-[var(--font-space-grotesk)] text-3xl font-semibold tracking-tight text-white">
              Sign in to your dashboard
            </h1>
            <p className="vf-login-description mt-2 text-sm text-slate-200/80">
              Access your feed, manage your posts, and track engagement.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-100">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter email"
                required
                className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-100">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 pr-12 text-white placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                      <path
                        d="M3 3l18 18"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.6 10.6a2 2 0 102.8 2.8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.7 6.7C4.6 8.1 3.2 10 2.5 12c1.4 4.1 5 7 9.5 7 2 0 3.9-.6 5.4-1.7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 4.6A10 10 0 0112 4c4.5 0 8.1 2.9 9.5 8-.4 1.2-1 2.2-1.7 3.2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                      <path
                        d="M2.5 12C3.9 7.9 7.5 5 12 5s8.1 2.9 9.5 7c-1.4 4.1-5 7-9.5 7S3.9 16.1 2.5 12z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="vf-btn-primary w-full px-4 py-3 text-sm transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-300">
            New here?{" "}
            <Link href="/register" className="font-medium text-cyan-300 hover:text-cyan-200">
              Create an account
            </Link>
          </p>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          {token ? (
            <p className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              Logged in successfully. Access token received.
            </p>
          ) : null}

          <div id="about" className="vf-login-about mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="vf-login-about-title text-sm font-semibold text-white">About VoteFlow</p>
            <p className="vf-login-about-text mt-1 text-xs leading-5 text-slate-300">
              VoteFlow helps users create posts, vote on community content, and manage personal
              posts through a secure authentication flow.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
