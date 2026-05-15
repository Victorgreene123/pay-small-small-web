'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !token && !user && pathname.startsWith('/dashboard')) {
      router.push('/auth/login');
    }
  }, [user, isLoading, token, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FF]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#22C55E]/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#22C55E] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#0D1B2A] font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Session</p>
        </div>
      </div>
    );
  }

  if (!user && pathname.startsWith('/dashboard')) {
    return null;
  }

  return <>{children}</>;
};
