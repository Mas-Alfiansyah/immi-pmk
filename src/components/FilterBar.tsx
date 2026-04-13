import { Calendar } from 'lucide-react';

interface FilterBarProps {
  bulan: string;
  setBulan: (b: string) => void;
  tahun: string;
  setTahun: (t: string) => void;
}

const BULAN_LIST = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const TAHUN_LIST = ['2024', '2025', '2026', '2027'];

export const FilterBar = ({ bulan, setBulan, tahun, setTahun }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 text-slate-500 mr-2">
        <Calendar size={20} />
        <span className="font-bold text-sm uppercase tracking-wider">Filter Periode</span>
      </div>

      <div className="flex gap-2">
        <select
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
        >
          {BULAN_LIST.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
        >
          {TAHUN_LIST.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
