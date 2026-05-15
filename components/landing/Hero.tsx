"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-dvh overflow-hidden px-4 sm:px-6 pb-16 pt-28 sm:pt-32">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7fcf8_0%,#fbfefb_28%,#ffffff_72%,#ffffff_100%)]" />
      <div className="absolute inset-x-0 top-0 h-128 bg-[radial-gradient(circle_at_50%_-10%,rgba(34,197,94,0.12),transparent_58%),radial-gradient(circle_at_18%_16%,rgba(34,197,94,0.06),transparent_22%),radial-gradient(circle_at_82%_14%,rgba(34,197,94,0.05),transparent_20%)]" />
      <div className="absolute inset-x-0 top-24 h-80 bg-[radial-gradient(circle_at_50%_40%,rgba(34,197,94,0.05),transparent_74%)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-80 bg-[linear-gradient(180deg,transparent_0%,rgba(13,27,42,0.016)_100%)]" />
      <div className="absolute inset-0 opacity-[0.045] bg-[linear-gradient(rgba(13,27,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(13,27,42,0.05)_1px,transparent_1px)] bg-size-[112px_112px] mask-[linear-gradient(180deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.34)_48%,transparent_100%)]" />
      <div className="absolute left-1/2 top-16 h-56 w-56 -translate-x-1/2 rounded-full bg-[#22C55E]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-6xl text-center">

          <h1 className="mx-auto mt-8 w-full max-w-6xl text-balance text-5xl font-black leading-[0.9] tracking-tight text-[#0D1B2A] sm:text-6xl md:text-7xl xl:text-[6.4rem]">
            Trust flows for community money.
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            TrustLedger adds a real-time trust score to every campaign and
            contributor, then routes payments through Squad so communities can
            raise, verify, and disburse money with confidence.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D1B2A] px-7 py-4 text-sm font-black uppercase tracking-[0.24em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-18px_rgba(13,27,42,0.72)] active:translate-y-0"
            >
              Sign up
              <ArrowRight className="h-4 w-4 text-[#22C55E]" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full border border-[#DDE7DF] bg-white/70 px-7 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#0D1B2A] shadow-[0_14px_30px_-22px_rgba(13,27,42,0.42)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#22C55E]/30 hover:bg-white"
            >
              Start campaign
            </Link>
          </div>

          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white/70 px-4 py-2 font-semibold shadow-[0_14px_28px_-24px_rgba(13,27,42,0.28)] backdrop-blur-xl">
              <ShieldCheck className="h-4 w-4 text-[#22C55E]" />
              Squad verified payments
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white/70 px-4 py-2 font-semibold shadow-[0_14px_28px_-24px_rgba(13,27,42,0.28)] backdrop-blur-xl">
              Real-time risk scoring
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
