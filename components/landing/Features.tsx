"use client";

import React from "react";

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcf8_100%)]">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_18%_16%,rgba(34,197,94,0.38),transparent_22%),radial-gradient(circle_at_82%_28%,rgba(13,27,42,0.10),transparent_18%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#1f8a45]">Features</p>

            <h2 className="mt-4 max-w-[9ch] text-4xl font-black tracking-tight text-[#0D1B2A] sm:text-5xl lg:text-6xl lg:leading-[0.94]">
              Built to make trust readable.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              This section is designed like a control sequence: score the campaign, verify the payment, then release the payout only when the flow stays clean.
            </p>

            <div className="mt-8 rounded-[2.5rem] border border-[#E5E7EB] bg-white/80 p-7 shadow-[0_20px_60px_-38px_rgba(13,27,42,0.28)] backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="mt-2 h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_0_8px_rgba(34,197,94,0.10)]" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.32em] text-[#1f8a45]">One trust layer</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Campaign scoring, payment checks, and payout controls stay in one place, so the experience feels calm and legible.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:auto-rows-fr">
            {/* Primary: Step one - large tile */}
            <div className="md:col-span-2 md:row-span-2 rounded-[2.5rem] border border-[#E5E7EB] bg-white p-8 sm:p-10 shadow-[0_24px_70px_-44px_rgba(13,27,42,0.28)] transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex flex-col gap-8 h-full">
                <div className="max-w-2xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#1f8a45]">Step one</p>
                  <h3 className="mt-4 text-2xl font-black tracking-tight text-[#0D1B2A] sm:text-3xl">Campaigns get a live trust score before money moves.</h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">TrustLedger combines account history, verification status, and behavioral signals into one readable trust score that users can act on immediately.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[2.5rem] border border-[#E5E7EB] bg-[#F8FCF8] p-6 sm:p-7">
                    <div className="flex items-end justify-between gap-6">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Current score</p>
                        <p className="mt-2 text-6xl font-black tracking-tight text-[#0D1B2A]">85</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#1f8a45]">Low risk</p>
                        <p className="mt-1 text-sm text-slate-500">Verified campaign</p>
                      </div>
                    </div>

                    <div className="mt-5 h-2 rounded-full bg-white">
                      <div className="h-full w-[85%] rounded-full bg-[linear-gradient(90deg,#B7E9C1_0%,#22C55E_60%,#0D1B2A_100%)]" />
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="rounded-3xl bg-white px-4 py-3 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Data</p>
                        <p className="mt-1 text-sm font-black text-[#0D1B2A]">History</p>
                      </div>
                      <div className="rounded-3xl bg-white px-4 py-3 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Signals</p>
                        <p className="mt-1 text-sm font-black text-[#0D1B2A]">Behavior</p>
                      </div>
                      <div className="rounded-3xl bg-white px-4 py-3 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Outcome</p>
                        <p className="mt-1 text-sm font-black text-[#0D1B2A]">Readable</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-[2.5rem] border border-[#E5E7EB] bg-white p-6 sm:p-7">
                    <div className="rounded-3xl bg-[#F4F8FF] px-5 py-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Fraud detection</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">Suspicious timing, duplicate accounts, and abnormal payout behavior are flagged before money moves.</p>
                    </div>
                    <div className="rounded-3xl bg-[#F4F8FF] px-5 py-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Instant verification</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">Squad confirms payments in real time, so contributors see immediate status updates without guesswork.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side column tiles */}
            <div className="rounded-[1.75rem] border border-[#E5E7EB] bg-white p-6 sm:p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Fraud detection</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Suspicious timing, duplicate accounts, and abnormal payout behavior are flagged before money moves.</p>
            </div>

            <div className="rounded-[1.75rem] border border-[#E5E7EB] bg-white p-6 sm:p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Instant verification</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Squad confirms payments in real time, so contributors see immediate status updates without guesswork.</p>
            </div>

            <div className="md:col-span-3 rounded-[2.5rem] border border-[#0D1B2A] bg-[linear-gradient(135deg,#0D1B2A_0%,#11283d_100%)] p-7 text-white shadow-[0_24px_70px_-42px_rgba(13,27,42,0.5)] transition-all duration-300 hover:-translate-y-0.5 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#B7E9C1]">Step two and three</p>
                  <h3 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">Verification and payout stay visible until the flow is complete.</h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">Every campaign keeps a live history of contribution status, verification events, and payout readiness so the money trail stays readable.</p>
                </div>

                <div className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 sm:min-w-55">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-300">Contributions</span>
                    <span className="font-black text-white">10 / 10</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-300">Verification</span>
                    <span className="font-black text-[#B7E9C1]">Complete</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-300">Payout state</span>
                    <span className="font-black text-white">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
