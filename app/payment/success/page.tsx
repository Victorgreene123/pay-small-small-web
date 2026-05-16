'use client';

import { CheckCircle2, Sparkles } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F4F8FF] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center justify-center">
        <div className="relative w-full overflow-hidden rounded-4xl border border-white/70 bg-white p-8 shadow-lg sm:p-12">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E]/10 text-[#22C55E]">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h1 className="text-3xl font-black text-[#0D1B2A]">Payment confirmed</h1>
            <p className="max-w-xl text-slate-500">Thank you. Your payment has been received and confirmed. </p>

          </div>
        </div>
      </div>
    </main>
  );
}
