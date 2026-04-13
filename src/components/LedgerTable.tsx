import type { LedgerEntry } from '../types';
import { motion } from 'framer-motion';
import { BookOpen, ArrowDownCircle, ArrowUpCircle, History } from 'lucide-react';

interface LedgerTableProps {
  entries: LedgerEntry[];
  isLoading: boolean;
}

export const LedgerTable = ({ entries, isLoading }: LedgerTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-24 text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-amber-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Memuat Arsip...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      {/* Header Elegan */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/20">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Buku Besar</h2>
            <p className="text-amber-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Catatan Keuangan IMMI</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">
          <History size={14} /> Riwayat Transaksi
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50">
              <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Tanggal</th>
              <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Saldo Awal</th>
              <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Pemasukan</th>
              <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Pengeluaran</th>
              <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Sisa Saldo</th>
              <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-32 text-center">
                  <div className="opacity-20 flex flex-col items-center">
                    <BookOpen size={64} className="mb-4 text-slate-400" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Belum ada catatan transaksi</p>
                  </div>
                </td>
              </tr>
            ) : (
              entries.map((entry, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  key={idx} 
                  className="hover:bg-amber-50/30 transition-all duration-300 group"
                >
                  <td className="py-5 px-6 text-sm font-black text-slate-700 tracking-tighter">
                    {formatDate(entry.tanggal)}
                  </td>
                  <td className="py-5 px-6 text-sm font-bold text-slate-300">
                    {entry.saldo > 0 ? formatCurrency(entry.saldo) : 'Rp 0'}
                  </td>
                  <td className="py-5 px-6">
                    {entry.masuk > 0 ? (
                      <div className="flex items-center gap-2">
                        <ArrowUpCircle size={16} className="text-emerald-500" />
                        <span className="text-sm font-black text-emerald-600">+{formatCurrency(entry.masuk)}</span>
                      </div>
                    ) : (
                      <span className="text-slate-200">—</span>
                    )}
                  </td>
                  <td className="py-5 px-6">
                    {entry.keluar > 0 ? (
                      <div className="flex items-center gap-2">
                        <ArrowDownCircle size={16} className="text-rose-500" />
                        <span className="text-sm font-black text-rose-600">-{formatCurrency(entry.keluar)}</span>
                      </div>
                    ) : (
                      <span className="text-slate-200">—</span>
                    )}
                  </td>
                  <td className="py-5 px-6">
                    <div className="bg-indigo-50 text-indigo-700 font-black text-sm px-4 py-2 rounded-xl border border-indigo-100 inline-block">
                      {formatCurrency(entry.sisa)}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <p className="text-xs font-bold text-slate-500 line-clamp-1 max-w-[200px] group-hover:text-slate-800 transition-colors uppercase">
                      {entry.ket}
                    </p>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};