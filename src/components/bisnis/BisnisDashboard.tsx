import { 
  Briefcase, 
  ShoppingCart, 
  UserCheck, 
  TrendingUp, 
  ArrowRight
} from 'lucide-react';

export const BisnisDashboard = ({ onNavigateToDompet }: { onNavigateToDompet: () => void }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="bg-indigo-50 px-6 py-4 rounded-xl border border-indigo-100 flex-1 w-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Briefcase size={20} />
            </div>
            <h2 className="text-xl font-black text-indigo-900 tracking-tighter uppercase">Ringkasan Bisnis</h2>
          </div>
          <p className="text-sm font-bold text-indigo-600/80">Pantau performa bisnis dan transaksi seller Anda secara real-time.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white h-[150px] p-6 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={64} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Total Omset</p>
          <p className="text-3xl font-black text-slate-800 tracking-tighter relative z-10">Rp 0</p>
        </div>
        <div className="bg-white h-[150px] p-6 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={64} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Total Profit</p>
          <p className="text-3xl font-black text-slate-800 tracking-tighter relative z-10">Rp 0</p>
        </div>
        <div className="bg-white h-[150px] p-6 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <ShoppingCart size={64} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Total Transaksi</p>
          <p className="text-3xl font-black text-slate-800 tracking-tighter relative z-10">0</p>
        </div>
        <div className="bg-white h-[150px] p-6 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <UserCheck size={64} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Seller Aktif</p>
          <p className="text-3xl font-black text-slate-800 tracking-tighter relative z-10">0</p>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Transaksi Bisnis Terbaru</h3>
          <button 
            onClick={onNavigateToDompet}
            className="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center gap-1"
          >
            Lihat Semua <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Tanggal</th>
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Seller</th>
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Item</th>
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Total</th>
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 opacity-60">
                    <Briefcase size={48} className="mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">Belum ada data transaksi</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
