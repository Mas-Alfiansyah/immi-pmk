import { ArrowDownRight, ArrowUpRight, Wallet, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface SummaryCardsProps {
  totalOnline: number;
  totalOffline: number;
  totalKas: number;
  isLoading: boolean;
}

export const SummaryCards = ({ totalOnline, totalOffline, totalKas, isLoading }: SummaryCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Setoran Online',
      amount: totalOnline,
      icon: ArrowUpRight,
      // Menggunakan gradasi dari biru tua ke biru yang sedikit lebih cerah
      gradient: 'from-blue-600 to-blue-800',
      iconBg: 'bg-white/20',
      textColor: 'text-white',
      labelColor: 'text-blue-100'
    },
    {
      title: 'Setoran Offline',
      amount: totalOffline,
      icon: ArrowDownRight,
      // Menggunakan warna Amber/Orange yang hangat
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-white/20',
      textColor: 'text-white',
      labelColor: 'text-amber-100'
    },
    {
      title: 'Total Saldo Kas',
      amount: totalKas,
      icon: Wallet,
      // Menggunakan Emerald sesuai identitas "Hijau" yang biasanya identik dengan Kas
      gradient: 'from-emerald-600 to-teal-800',
      iconBg: 'bg-white/20',
      textColor: 'text-white',
      labelColor: 'text-emerald-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {cards.map((card, idx) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          key={idx}
          className={`relative overflow-hidden p-8 rounded-2xl shadow-2xl bg-linear-to-br ${card.gradient} group hover:translate-y-[-8px] transition-all duration-300`}
        >
          {/* Efek Cahaya Dekoratif di Background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-[0.1] rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-[0.05] rounded-full -ml-10 -mb-10" />

          <div className="flex items-center justify-between mb-6">
            <div className={`${card.iconBg} p-4 rounded-xl backdrop-blur-md text-white border border-white/20`}>
              <card.icon size={28} />
            </div>
            
            {isLoading ? (
              <div className="animate-pulse bg-white/20 h-6 w-16 rounded-full" />
            ) : (
                <div className="flex items-center gap-2 text-white font-bold text-[10px] bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  <TrendingUp size={12} className="animate-bounce" /> LIVE
                </div>
            )}
          </div>
          
          <div className="relative z-10">
            <p className={`text-[11px] font-bold ${card.labelColor} uppercase tracking-[0.2em] mb-1`}>
              {card.title}
            </p>
            <h3 className={`text-3xl font-black ${card.textColor} tracking-tight`}>
              {isLoading ? (
                <div className="h-9 w-32 bg-white/20 animate-pulse rounded-lg" />
              ) : (
                formatCurrency(card.amount)
              )}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};