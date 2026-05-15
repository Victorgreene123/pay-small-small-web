'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  PlusCircle, 
  Settings, 
  HelpCircle,
  CreditCard,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'My Splits', icon: Users, href: '/dashboard/splits/me' },
    { name: 'Banks', icon: CreditCard, href: '/dashboard/payments/banks' },
  ];

  const secondaryItems = [
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },

  ];

  const LinkItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-[#DBEAFE] text-blue-600 shadow-sm' 
            : 'text-slate-500 hover:bg-[#F4F8FF] hover:text-[#0D1B2A]'
        }`}
      >
        <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-[#0D1B2A]'}`} />
        <span className="font-semibold text-sm">{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#0D1B2A]/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#E5E7EB] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-10">
            <Link href="/dashboard" className="flex items-center gap-x-3">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            </Link>
            <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* New Split Button */}
          <Link 
            href="/dashboard/splits/create"
            onClick={onClose}
            className="flex items-center justify-center gap-x-2 bg-[#F4F8FF] text-[#0D1B2A] hover:bg-blue-100 p-4 rounded-2xl font-bold transition-all mb-10 group border border-[#E5E7EB]"
          >
            <PlusCircle className="w-5 h-5 text-blue-600 group-hover:rotate-90 transition-transform" />
            Create Split
          </Link>

          {/* Nav Links */}
          <nav className="flex-1 space-y-2">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
            {menuItems.map((item) => (
              <LinkItem key={item.name} item={item} />
            ))}
          </nav>

          {/* Secondary Links */}
          <div className="mt-auto space-y-2 pt-10">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Support</p>
            {secondaryItems.map((item) => (
              <LinkItem key={item.name} item={item} />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
