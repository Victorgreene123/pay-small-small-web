'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut, Bell, Search, Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 w-full">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <button 
            onClick={onMenuClick}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-3 py-2 w-72">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search splits or records..." 
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

          <div className="flex items-center gap-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button 
              onClick={logout}
              className="ml-2 p-2 text-slate-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
