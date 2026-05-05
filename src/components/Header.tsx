import { LogOut, Menu, Bell } from 'lucide-react';

interface HeaderProps {
  onLogout?: () => void;
  user?: { nama: string } | null;
  onMenuClick: () => void;
  title: string;
}

export const Header = ({ onLogout, user, onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-white backdrop-blur-xl border-b border-slate-100" />
      
      <div className="container mx-auto px-6 h-20 flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-indigo-600 transition-all shadow-sm"
          >
            <Menu size={24} />
          </button>
          <div>
            <img src="" alt="" />
            {/* <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">{title}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Sistem Manajemen Keuangan PMK</p> */}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-500 transition-all shadow-sm relative group">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          <div className="h-10 w-px bg-slate-100 mx-2 hidden sm:block" />

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{user?.nama || 'Admin Panel'}</span>
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Active Session</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2.5 bg-white border border-slate-100 rounded-xl text-rose-500 hover:bg-rose-50 transition-all shadow-sm group"
              title="Keluar dari sistem"
            >
              <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
