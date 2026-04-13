import type { MemberPayment } from '../types';
import { formatCurrency } from '../utils/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface MemberTableProps {
  payments: MemberPayment[];
  bulan: string;
}

export const MemberTable = ({ payments, bulan }: MemberTableProps) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 pb-10 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
          Laporan Kas - <span className="text-primary-600 font-black">{bulan}</span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="py-4 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 text-center w-12">NO</th>
              <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">NAMA</th>
              
              {/* Termin 1 Column Group */}
              <th className="py-2 px-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-slate-100 text-center bg-emerald-50/30" colSpan={3}>Pembayaran 1</th>
              
              {/* Termin 2 Column Group */}
              <th className="py-2 px-4 text-[10px] font-black text-blue-600 uppercase tracking-widest border border-slate-100 text-center bg-blue-50/30" colSpan={3}>Pembayaran 2</th>
              
              <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 text-center">Total</th>
            </tr>
            <tr className="bg-slate-50/20">
              <th className="border border-slate-100"></th>
              <th className="border border-slate-100"></th>
              
              <th className="py-2 px-2 text-[9px] font-bold text-slate-400 uppercase border border-slate-100 text-center">Tanggal</th>
              <th className="py-2 px-2 text-[9px] font-bold text-slate-400 uppercase border border-slate-100 text-center">Nominal</th>
              <th className="py-2 px-2 text-[9px] font-bold text-slate-400 uppercase border border-slate-100 text-center">Metode</th>
              
              <th className="py-2 px-2 text-[9px] font-bold text-slate-400 uppercase border border-slate-100 text-center">Tanggal</th>
              <th className="py-2 px-2 text-[9px] font-bold text-slate-400 uppercase border border-slate-100 text-center">Nominal</th>
              <th className="py-2 px-2 text-[9px] font-bold text-slate-400 uppercase border border-slate-100 text-center">Metode</th>
              
              <th className="border border-slate-100"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='popLayout'>
              {payments.map((m) => {
                const total = Number(m.v1 || 0) + Number(m.v2 || 0);
                return (
                  <motion.tr
                    key={m.nama}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-3 border border-slate-50 text-center text-xs font-medium text-slate-400">{m.no}</td>
                    <td className="py-3 px-4 border border-slate-50 font-bold text-slate-700 text-sm whitespace-nowrap">{m.nama}</td>
                    
                    {/* Termin 1 */}
                    <td className="py-3 px-2 border border-slate-50 text-center text-[11px] text-slate-500">
                      {m.t1 ? format(new Date(m.t1), 'dd MMM') : '-'}
                    </td>
                    <td className="py-3 px-2 border border-slate-50 text-center text-xs font-bold text-slate-600">
                      {m.v1 > 0 ? formatCurrency(m.v1).replace('Rp', '') : '-'}
                    </td>
                    <td className="py-3 px-2 border border-slate-50 text-center capitalize text-[10px]">
                      {m.m1 ? (
                        <span className={`px-2 py-0.5 rounded-md font-bold ${m.m1 === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {m.m1}
                        </span>
                      ) : '-'}
                    </td>

                    {/* Termin 2 */}
                    <td className="py-3 px-2 border border-slate-50 text-center text-[11px] text-slate-500">
                      {m.t2 ? format(new Date(m.t2), 'dd MMM') : '-'}
                    </td>
                    <td className="py-3 px-2 border border-slate-50 text-center text-xs font-bold text-slate-600">
                      {m.v2 > 0 ? formatCurrency(m.v2).replace('Rp', '') : '-'}
                    </td>
                    <td className="py-3 px-2 border border-slate-50 text-center capitalize text-[10px]">
                      {m.m2 ? (
                        <span className={`px-2 py-0.5 rounded-md font-bold ${m.m2 === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {m.m2}
                        </span>
                      ) : '-'}
                    </td>

                    {/* Total */}
                    <td className="py-3 px-4 border border-slate-50 text-center font-black text-sm text-primary-600 bg-primary-50/20">
                      {formatCurrency(total)}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
