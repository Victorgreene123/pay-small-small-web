"use client";

import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const benefits = [
  "No account minimums",
  "Instant verification",
  "Zero fraud protection",
  "Transparent fees",
];

export default function CTA() {
  return (
    <section
      id="get-started"
      className="relative py-20 sm:py-32 px-4 sm:px-6 bg-linear-to-b from-[#F4F8FF] to-white overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E]/3 rounded-full blur-3xl -mr-40 -mt-40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] border border-[#E5E7EB] p-12 sm:p-16 shadow-sm">
          {/* Content grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-[#0D1B2A] tracking-tighter mb-6">
                Ready to Transform Group Payments?
              </h2>
              <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed">
                Join thousands of communities and creators using TrustLedger to
                fundraise with confidence.
              </p>

              {/* Benefits list */}
              <div className="space-y-3 mb-10">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
                    <span className="text-slate-700 font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="px-6 py-3 bg-[#0D1B2A] text-[#22C55E] rounded-full font-black uppercase tracking-widest text-sm flex items-center gap-2 transition-all duration-200 active:scale-95"
                >
                  Create <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right side - Feature callout (clean, no fake stats) */}
            <div className="bg-linear-to-br from-[#0D1B2A] to-[#1a2b3a] rounded-[2.5rem] p-10 text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#22C55E]/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <p className="text-xs font-black text-[#22C55E] uppercase tracking-widest mb-3">
                  Power of Trust
                </p>
                <h3 className="text-2xl font-black mb-4 leading-tight">
                  AI-verified group payments
                </h3>
                <p className="text-sm text-slate-300 mb-6">
                  Transparent verification, instant status, and clear payout
                  signals so communities can move money with confidence.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
                    <span className="text-sm font-medium text-white">
                      AI verification layer
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
                    <span className="text-sm font-medium text-white">
                      Real-time contribution status
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
                    <span className="text-sm font-medium text-white">
                      Payouts that follow clear rules
                    </span>
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
