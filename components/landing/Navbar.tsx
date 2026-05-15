"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ease-out ${
        isCompact ? "top-4 w-[min(84vw,1020px)]" : "top-4 w-[min(92vw,1180px)]"
      }`}
    >
      <div className="flex items-center justify-between gap-4 rounded-full border border-white/70 bg-white/82 px-4 py-3 backdrop-blur-2xl shadow-[0_24px_70px_-30px_rgba(13,27,42,0.35)]">
        <Link href="/" className="flex items-center gap-3">
          <div>
            <Image
              src="/logo.png"
              alt="TrustLedger logo"
              width={124}
              height={124}
              className=" object-contain"
              priority
            />
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-500">
          <a
            href="#features"
            className="transition-colors hover:text-[#0D1B2A]"
          >
            Features
          </a>
          <a href="#process" className="transition-colors hover:text-[#0D1B2A]">
            How it works
          </a>
          <a href="#trust" className="transition-colors hover:text-[#0D1B2A]">
            Trust
          </a>
          <a
            href="#security"
            className="transition-colors hover:text-[#0D1B2A]"
          >
            Security
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex rounded-full px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#0D1B2A]"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-full bg-[#0D1B2A] px-5 py-2.5 text-sm font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#13283f] hover:shadow-[0_18px_40px_-18px_rgba(13,27,42,0.7)] active:translate-y-0"
          >
            Sign up
            <ArrowRight className="h-4 w-4 text-[#22C55E]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
