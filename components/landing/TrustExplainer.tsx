"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const trustFactors = [
  {
    factor: "Account Age",
    description:
      "Newer accounts with no history start cautiously; established accounts with clean records score higher.",
    icon: "📅",
  },
  {
    factor: "Verification Status",
    description:
      "Verified phone, email, and BVN boost trust significantly. We never ask for unnecessary KYC.",
    icon: "✓",
  },
  {
    factor: "Payment History",
    description:
      "Campaigns successfully funded and on-time payments from the past build a stronger score.",
    icon: "✓",
  },
  {
    factor: "Behavioral Signals",
    description:
      "Consistent data, normal payment timing, and typical contribution amounts signal legitimacy.",
    icon: "📊",
  },
  {
    factor: "Anomaly Detection",
    description:
      "Unusual withdrawals, duplicate accounts, or inconsistent data patterns are flagged automatically.",
    icon: "⚠️",
  },
  {
    factor: "Peer Network",
    description:
      "Participants with trusted peers and positive social proof elevate campaign credibility.",
    icon: "👥",
  },
];

export default function TrustExplainer() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section
      id="trust"
      className="relative py-20 sm:py-32 px-4 sm:px-6 bg-white"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-[#0D1B2A] tracking-tighter mb-4">
            How We Calculate Trust
          </h2>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Our hybrid AI model combines rule-based checks and ML patterns to
            assign a transparent, explainable trust score.
          </p>
        </div>

        {/* Trust score visualization */}
        <div className="mb-16 bg-linear-to-br from-[#F4F8FF] to-white rounded-4xl border border-[#E5E7EB] p-10 text-center">
          <div className="mb-4">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
              Sample Campaign
            </p>
            <p className="text-5xl font-black text-[#22C55E] mb-2">78%</p>
            <p className="text-sm text-slate-600 font-medium">
              Verified • Low Risk
            </p>
          </div>
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>High Risk</span>
              <span>Low Risk</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-[#E5E7EB]">
              <div className="h-full w-[78%] bg-linear-to-r from-red-500 via-yellow-500 to-[#22C55E] rounded-full" />
            </div>
          </div>
        </div>

        {/* Trust factors accordion */}
        <div className="space-y-3">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
            Trust Factors
          </p>
          {trustFactors.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden transition-all duration-300 hover:border-[#22C55E]/30"
            >
              <button
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F4F8FF]/50 transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-black text-[#0D1B2A] text-sm">
                      {item.factor}
                    </h4>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expanded === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expanded === idx && (
                <div className="px-6 pb-4 border-t border-[#E5E7EB] bg-[#F4F8FF]/30">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-8 bg-[#F4F8FF] rounded-4xl border border-[#E5E7EB] text-center">
          <h3 className="text-xl font-black text-[#0D1B2A] mb-2">
            Transparency is Built In
          </h3>
          <p className="text-slate-600 font-medium mb-4">
            Every campaign shows exactly which factors influence its trust
            score—no black boxes, just trust.
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Our model prioritizes explainability so you always know why a
            campaign or participant is flagged.
          </p>
        </div>
      </div>
    </section>
  );
}
