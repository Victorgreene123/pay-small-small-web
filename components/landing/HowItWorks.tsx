"use client";

import React from "react";
import { ArrowRight, CheckCircle2, Plus, Send, Users } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Plus,
    title: "Create a Campaign",
    description:
      "Set up a group payment with your target amount. Our AI instantly calculates a trust score based on your account history and verification status.",
    color: "text-[#22C55E]",
    bgColor: "bg-[#22C55E]/10",
  },
  {
    number: "02",
    icon: Users,
    title: "Invite & Collect",
    description:
      "Share the link with contributors. Each participant sees your trust score, pays securely via Squad (cards, bank transfers, USSD), and is instantly verified.",
    color: "text-[#0D1B2A]",
    bgColor: "bg-[#F4F8FF]",
  },
  {
    number: "03",
    icon: Send,
    title: "Withdraw Instantly",
    description:
      "Once funds are collected, withdraw directly to your verified bank account. Real-time transfers, transparent fees, zero fraud.",
    color: "text-[#22C55E]",
    bgColor: "bg-[#22C55E]/10",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="process"
      className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcf8_100%)]" />
      <div className="absolute left-1/2 top-0 h-72 w-[90%] -translate-x-1/2 rounded-full bg-[#22C55E]/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#1f8a45]">
            How it works
          </p>
          <h2 className="mt-4 max-w-[10ch] text-4xl font-black tracking-tight text-[#0D1B2A] sm:text-5xl lg:text-6xl lg:leading-[0.95]">
            A clean flow from trust to payout.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            TrustLedger turns group payments into a guided sequence. Campaigns
            get scored, contributors get verified, and payouts only move when
            the flow is clean.
          </p>

          <div className="mt-8 rounded-4xl border border-[#E5E7EB] bg-white/80 p-6 shadow-[0_20px_60px_-38px_rgba(13,27,42,0.3)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#22C55E]/10 text-[#1f8a45]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-[#0D1B2A]">
                  Designed for clarity
                </p>
                <p className="text-sm text-slate-500">
                  Every step explains what happens next and why it is trusted.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.26em] text-slate-400">
              <span className="h-px flex-1 bg-[#E5E7EB]" />
              Campaigns, contributors, payouts
              <span className="h-px flex-1 bg-[#E5E7EB]" />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-7 top-4 bottom-4 hidden w-px bg-[linear-gradient(180deg,rgba(34,197,94,0.45),rgba(13,27,42,0.12),transparent)] lg:block" />

          <div className="space-y-6 sm:space-y-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;

              return (
                <article
                  key={step.number}
                  className="relative flex gap-4 sm:gap-6"
                >
                  <div className="relative z-10 mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#DDEFE0] bg-white shadow-[0_18px_40px_-24px_rgba(13,27,42,0.24)]">
                    <Icon className={`h-6 w-6 ${step.color}`} />
                  </div>

                  <div
                    className={`min-w-0 flex-1 rounded-4xl border border-[#E5E7EB] ${step.bgColor} p-6 sm:p-7 shadow-[0_18px_50px_-34px_rgba(13,27,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-40px_rgba(13,27,42,0.22)]`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.34em] text-slate-400">
                          Step {step.number}
                        </p>
                        <h3 className="mt-3 text-2xl font-black tracking-tight text-[#0D1B2A]">
                          {step.title}
                        </h3>
                      </div>

                      <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#DDEFE0] bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#1f8a45]">
                        {idx === 0
                          ? "Initialize"
                          : idx === 1
                            ? "Verify"
                            : "Release"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                      {step.description}
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-white/80 px-4 py-3 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                          Trust
                        </p>
                        <p className="mt-1 text-lg font-black text-[#0D1B2A]">
                          Live
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/80 px-4 py-3 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                          Squad
                        </p>
                        <p className="mt-1 text-lg font-black text-[#0D1B2A]">
                          Active
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/80 px-4 py-3 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                          Status
                        </p>
                        <p className="mt-1 text-lg font-black text-[#0D1B2A]">
                          {idx === 2 ? "Ready" : "Queued"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isLast && (
                    <div className="absolute left-7 top-[5.4rem] hidden h-[calc(100%+1.5rem)] w-px bg-[#E5E7EB] lg:block" />
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
