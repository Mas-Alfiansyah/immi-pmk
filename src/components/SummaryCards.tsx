import { Wallet, CreditCard, Banknote } from 'lucide-react';
import type { MonthlyStats } from '../types';
import { formatCurrency } from '../utils/ui';
import { motion } from 'framer-motion';

interface SummaryCardsProps {
  stats: MonthlyStats;
}

export const SummaryCards = ({ stats }: SummaryCardsProps) => {
  const cards = [
    {
      label: 'Setoran Online',
      value: stats.totalOnline,
      icon: CreditCard,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Setoran Offline',
      value: stats.totalOffline,
      icon: Banknote,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Total Saldo Kas',
      value: stats.totalKas,
      icon: Wallet,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
      border: 'border-primary-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-8 rounded-[32px] border ${card.border} ${card.bg} shadow-sm relative overflow-hidden group hover:shadow-lg transition-all`}
        >
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{card.label}</span>
            <div className={`p-2 rounded-xl bg-white shadow-sm ${card.color}`}>
              <card.icon size={20} />
            </div>
          </div>
          <div className={`text-2xl font-black relative z-10 ${card.color}`}>
            {formatCurrency(card.value)}
          </div>
          
          {/* Subtle background decoration */}
          <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform ${card.color}`}>
            <card.icon size={120} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
