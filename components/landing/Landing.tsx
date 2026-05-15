"use client";

import React from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
// import Features from "@/components/landing/Features";
import TrustExplainer from "@/components/landing/TrustExplainer";
import CTA from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      {/* <Features /> */}
      <TrustExplainer />
      <CTA />

      {/* Footer (simplified) */}
      <footer className="bg-[#0D1B2A] text-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <nav className="flex flex-wrap justify-center gap-6 mb-6">
            <a
              href="#process"
              className="text-sm hover:text-[#22C55E] transition"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-sm hover:text-[#22C55E] transition"
            >
              Built to make trust
            </a>
            <a
              href="#trust"
              className="text-sm hover:text-[#22C55E] transition"
            >
              How we calculate trust
            </a>
            <a
              href="#get-started"
              className="text-sm hover:text-[#22C55E] transition"
            >
              Get started
            </a>
            <a
              href="mailto:support@trustledger.example"
              className="text-sm hover:text-[#22C55E] transition"
            >
              Contact
            </a>
          </nav>

          <p className="text-sm text-slate-400 mb-4">
            Trusted group payments for communities and creators.
          </p>
          <div className="text-sm text-slate-500">
            &copy; 2026 TrustLedger. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
