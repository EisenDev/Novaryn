"use client";

import React, { useState, useEffect } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck, TrendingUp, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@novaryn.tech");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const savedToken = localStorage.getItem("novaryn_admin_token");
    if (savedToken) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials. Please verify your username and password.");
      } else {
        localStorage.setItem("novaryn_admin_token", data.token);
        localStorage.setItem("novaryn_admin_user", JSON.stringify(data.user));
        // Redirect to dashboard page
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login connection error:", err);
      setError("Unable to connect to the backend server. Please verify Docker containers are running using ./run.sh");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 antialiased font-sans">
      {/* 1. Left Feature Branding Column (Dark Theme Split Accent) */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-950 border-r border-slate-900 p-12 flex-col justify-between relative overflow-hidden select-none">
        {/* Subtle background glow matching landing page accent */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 z-10 text-left">
          <Link href="/" className="flex items-center gap-2.5">
            <img 
              src="/novaryn-logo.png" 
              alt="Novaryn Logo" 
              className="w-7 h-7 object-contain"
            />
            <span className="font-sans font-bold text-lg tracking-tight text-white uppercase">
              NOVARYN
            </span>
          </Link>
          <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full font-bold">
            v1.0.0
          </span>
        </div>

        <div className="my-auto flex flex-col gap-6 z-10 max-w-sm text-left">
          <h2 className="text-3xl font-semibold text-white tracking-tight leading-[1.25]">
            The Central Operating System for <span className="text-emerald-500">Novaryn.</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Securely manage leads, projects, and business operations from one unified platform.
          </p>

          <div className="flex flex-col gap-4.5 mt-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-500 shrink-0">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Secure & Encrypted</h4>
                <p className="text-[11px] text-slate-450 mt-0.5 leading-normal">Enterprise-grade security to protect your business and client data.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-500 shrink-0">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Real-time Insights</h4>
                <p className="text-[11px] text-slate-450 mt-0.5 leading-normal">Monitor performance, track leads, and grow your business with data.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono z-10 flex justify-between">
          <span>Protected System. Admins Only.</span>
          <span>© 2026 Novaryn Technologies. All rights reserved.</span>
        </div>
      </div>

      {/* 2. Right Workspace Column */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-50/50">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-[460px] bg-white border border-slate-200 p-8 rounded-3xl shadow-[0_4px_30px_rgba(15,23,42,0.015)] relative"
        >
          {/* Back to marketing */}
          <Link
            href="/"
            className="absolute top-6 right-6 text-xs text-slate-400 hover:text-slate-650 font-bold transition-colors"
          >
            Back to Site
          </Link>

          <div className="flex flex-col gap-2 text-center mb-8">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-xs text-slate-450 font-semibold">Sign in to your admin account to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 text-xs text-red-700 flex items-start gap-2.5 mb-6 text-left leading-relaxed">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-650 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-450" />
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
                  placeholder="admin@novaryn.tech"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-450" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-450 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs mt-1">
              <label className="flex items-center gap-2 text-slate-500 font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-350 accent-emerald-600 text-emerald-600 focus:ring-emerald-500/20"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-4 mt-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-bold text-sm shadow-md shadow-emerald-600/10 active:scale-98 transition-all cursor-pointer select-none"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social login divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-150" />
            </div>
            <span className="relative px-3 bg-white text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Or continue with
            </span>
          </div>

          {/* Social Sign-in Buttons */}
          <div className="grid grid-cols-2 gap-3.5">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-xs cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.122 4.114a5.99 5.99 0 0 1-6-6c0-3.31 2.69-6 6-6 1.496 0 2.87.55 3.926 1.455l3.125-3.125C18.665 2.457 15.632 1.5 12.24 1.5a10.5 10.5 0 0 0 0 21c5.82 0 10.635-4.22 10.635-10.5 0-.715-.065-1.405-.18-2.072H12.24z"/>
              </svg>
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-xs cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 23 23" fill="none">
                <path d="M0 0h11v11H0z" fill="#F25022"/>
                <path d="M12 0h11v11H12z" fill="#7FBA00"/>
                <path d="M0 12h11v11H0z" fill="#00A4EF"/>
                <path d="M12 12h11v11H12z" fill="#FFB900"/>
              </svg>
              <span>Microsoft</span>
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400 font-semibold">
            Need help? <a href={`mailto:novaryntec@gmail.com`} className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">Contact our support team</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
