import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Store, 
  Package, 
  Wallet,
  X,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuGroups = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Kas',
    items: [
      { id: 'iuran', label: 'Iuran Kas', icon: Users },
      { id: 'catatan', label: 'Buku Catatan', icon: BookOpen },
    ]
  },
  {
    title: 'Bisnis',
    items: [
      { id: 'transaksi', label: 'Transaksi', icon: ShoppingCart },
      { id: 'seller', label: 'Seller', icon: Store },
      { id: 'barang', label: 'Barang', icon: Package },
      { id: 'dompet', label: 'Dompet Bisnis', icon: Wallet },
    ]
  }
];

export const Sidebar = ({ activePage, onPageChange, isOpen, onClose }: SidebarProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-slate-100 shadow-2xl shadow-slate-200/50 md:shadow-none">
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-8 border-b border-slate-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="/IMMI.png" alt="IMMI" className="w-12 h-12 object-contain" />
          <span className="font-black text-slate-900 text-xl tracking-tighter uppercase">IMMI <span className="text-indigo-600">CASH</span></span>
        </div>
        <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-xl">
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{group.title}</h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      if (isMobile) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'} />
                      <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="text-white/50" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer info */}
      <div className="p-8 border-t border-slate-50">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Active & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar with Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-screen w-[280px] z-[70]"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Always Visible) */}
      {!isMobile && (
        <aside className="sticky top-0 left-0 h-screen w-[280px] z-40 hidden md:block">
          {sidebarContent}
        </aside>
      )}
    </>
  );
};
