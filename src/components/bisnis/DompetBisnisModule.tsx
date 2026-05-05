import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Calendar,
  Filter,
  Download,
  Plus,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { useDompet } from '../../hooks/useDompet';
import { useTransactions } from '../../hooks/useTransactions';

export const DompetBisnisModule = () => {
  const { stats, expenses, isLoading: isLoadingDompet, addExpense } = useDompet();
  const { transactions, isLoading: isLoadingTrx } = useTransactions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    kategori: 'Operasional',
    keterangan: '',
    nominal: 0
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addExpense(expenseForm);
    if (success) {
      setIsExpenseModalOpen(false);
      setExpenseForm({ kategori: 'Operasional', keterangan: '', nominal: 0 });
    }
  };

  // Combine and sort all history (Sales as income, Expenses as outgoing)
  const history = [
    ...transactions.map(t => ({
      id: t.id,
      tanggal: t.tanggal,
      tipe: 'masuk' as const,
      kategori: 'Penjualan',
      keterangan: `${t.barang} (${t.varian}) x ${t.jumlah}`,
      nominal: (t.harga_jual || 0) * (t.jumlah || 1) // Omset / Revenue
    })),
    ...expenses.map(e => ({
      id: e.id,
      tanggal: e.tanggal,
      tipe: 'keluar' as const,
      kategori: e.kategori,
      keterangan: e.keterangan,
      nominal: e.nominal
    }))
  ].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const filteredHistory = history.filter(h => 
    h.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = isLoadingDompet || isLoadingTrx;

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-indigo-600 rounded-xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Wallet size={160} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Saldo Dompet (Laba Bersih)</p>
          <h3 className="text-3xl font-black tracking-tighter mb-8">{formatCurrency(stats.labaBersih)}</h3>
          <button 
            onClick={() => setIsExpenseModalOpen(true)}
            className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all w-full border border-white/10"
          >
            <Plus size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Catat Pengeluaran</span>
          </button>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
               <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">Laba Kotor: {formatCurrency(stats.labaKotor)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                <ArrowDownLeft size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pemasukan (Omset)</span>
            </div>
            <p className="text-2xl font-black text-slate-800 tracking-tighter">{formatCurrency(stats.totalPemasukan)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-rose-50 p-3 rounded-xl text-rose-600">
                <ArrowUpRight size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pengeluaran</span>
            </div>
            <p className="text-2xl font-black text-slate-800 tracking-tighter">{formatCurrency(stats.totalPengeluaran)}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-slate-600 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
            <Calendar size={18} /> <span className="hidden sm:inline">Pilih Tanggal</span>
          </button>
          <button className="bg-white text-slate-600 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
            <Download size={18} /> <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[400px]">
        <div className="p-8 border-b border-slate-50 flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-xl">
            <Filter size={16} className="text-slate-400" />
          </div>
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Semua Riwayat Kas Bisnis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Tanggal</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Keterangan</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Kategori</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-indigo-600" size={32} />
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Belum ada riwayat transaksi
                  </td>
                </tr>
              ) : (
                filteredHistory.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-8">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-tighter italic">
                        {new Date(t.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <div className="font-bold text-slate-700 text-sm">{t.keterangan}</div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest">
                        {t.kategori}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <span className={`text-sm font-black tracking-tight ${t.tipe === 'masuk' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.tipe === 'masuk' ? '+' : '-'} {formatCurrency(t.nominal)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Modal */}
      <AnimatePresence>
        {isExpenseModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsExpenseModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="relative w-full max-w-md bg-white rounded-xl p-10 shadow-3xl flex flex-col" >
              <div className="flex items-center justify-between mb-8 flex-shrink-0">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Catat Pengeluaran</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Dipotong dari Laba Bersih</p>
                </div>
                <button onClick={() => setIsExpenseModalOpen(false)} className="bg-slate-50 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kategori</label>
                  <select 
                    value={expenseForm.kategori}
                    onChange={(e) => setExpenseForm({...expenseForm, kategori: e.target.value})}
                    className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
                  >
                    <option value="Operasional">Operasional</option>
                    <option value="Modal">Modal / Restock</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Keterangan</label>
                  <textarea 
                    required
                    value={expenseForm.keterangan}
                    onChange={(e) => setExpenseForm({...expenseForm, keterangan: e.target.value})}
                    placeholder="Contoh: Beli lakban & plastik packing"
                    className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800 h-24"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nominal (Rp)</label>
                  <input 
                    type="number"
                    required
                    value={expenseForm.nominal}
                    onChange={(e) => setExpenseForm({...expenseForm, nominal: Number(e.target.value)})}
                    className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-xl text-slate-800"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-5 bg-indigo-600 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  SIMPAN PENGELUARAN
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
