import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { MemberTable } from './components/MemberTable';
import { PaymentModal } from './components/PaymentModal';
import { FilterBar } from './components/FilterBar';
import { useMemberPayments } from './hooks/useMemberPayments';
import { motion } from 'framer-motion';

const getCurrentMonth = () => {
  return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date());
};

function App() {
  const [bulan, setBulan] = useState(getCurrentMonth());
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  
  const { payments, memberList, stats, addPayment, isLoading } = useMemberPayments(bulan, tahun);

  // Extract member names for combo box (memberList already sorted from server)
  const memberNames = useMemo(() => {
    return memberList.length > 0 ? memberList : payments.map(p => p.nama).sort();
  }, [memberList, payments]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900">
      <Header />
      
      <main className="container mx-auto px-4 max-w-7xl pb-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-[10px]">Dashboard Keuangan</p>
              <h2 className="text-4xl font-black tracking-tight text-slate-900">
                Iuran Kas <span className="text-primary-600">Anggota.</span>
              </h2>
            </div>
            
            <FilterBar 
              bulan={bulan} 
              setBulan={setBulan} 
              tahun={tahun} 
              setTahun={setTahun} 
            />
          </div>
        </motion.div>

        <SummaryCards stats={stats} />
        
        {isLoading && payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-slate-100 shadow-sm animate-pulse">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl mb-6"></div>
            <div className="h-6 w-64 bg-slate-100 rounded-full mb-3"></div>
            <div className="h-4 w-40 bg-slate-50 rounded-full"></div>
          </div>
        ) : (
          <MemberTable 
            payments={payments} 
            bulan={`${bulan} ${tahun}`} 
          />
        )}

        <PaymentModal 
          memberNames={memberNames} 
          onAdd={addPayment} 
          isLoading={isLoading}
          currentBulan={bulan}
          currentTahun={tahun}
        />
      </main>

      <footer className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
        <p>© 2026 AlKas - Premium Member Contribution System</p>
      </footer>
    </div>
  );
}

export default App;
