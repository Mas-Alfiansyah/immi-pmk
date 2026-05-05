import { useState } from 'react';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';

interface Transaction {
  id: string;
  tanggal: string;
  tipe: 'masuk' | 'keluar';
  kategori: string;
  keterangan: string;
  nominal: number;
}

export const DompetBisnisModule = () => {
  const [transactions] = useState<Transaction[]>([
    { id: '1', tanggal: '2024-03-20', tipe: 'masuk', kategori: 'Penjualan', keterangan: 'Penjualan Kaos IMMI (3 pcs)', nominal: 225000 },
    { id: '2', tanggal: '2024-03-19', tipe: 'keluar', kategori: 'Modal', keterangan: 'Restock Kaos IMMI (L & XL)', nominal: 105000 }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const stats = {
    totalMasuk: transactions.filter(t => t.tipe === 'masuk').reduce((acc, curr) => acc + curr.nominal, 0),
    totalKeluar: transactions.filter(t => t.tipe === 'keluar').reduce((acc, curr) => acc + curr.nominal, 0),
  };
  const saldo = stats.totalMasuk - stats.totalKeluar;

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-indigo-600 rounded-xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Wallet size={160} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Saldo Dompet Bisnis</p>
          <h3 className="text-3xl font-black tracking-tighter mb-8">{formatCurrency(saldo)}</h3>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2">
              <ArrowDownLeft size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">{formatCurrency(stats.totalMasuk)}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                <ArrowDownLeft size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pemasukan</span>
            </div>
            <p className="text-2xl font-black text-slate-800 tracking-tighter">{formatCurrency(stats.totalMasuk)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-rose-50 p-3 rounded-xl text-rose-600">
                <ArrowUpRight size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pengeluaran</span>
            </div>
            <p className="text-2xl font-black text-slate-800 tracking-tighter">{formatCurrency(stats.totalKeluar)}</p>
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
      <div className="bg-white rounded-xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
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
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 px-8">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tighter italic">{t.tanggal}</span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
