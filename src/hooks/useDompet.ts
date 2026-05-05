import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const SCRIPT_ID = 'AKfycbwNqK5eLUc5N2DOCCTIoodxCKQbAVwRkfIW6rUclteh_QKRrw1JPcGOPUVbK_54hf3_qw';
const SCRIPT_URL = import.meta.env.DEV 
  ? `/google-api/macros/s/${SCRIPT_ID}/exec`
  : `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export interface DompetStats {
  totalPemasukan: number;
  labaKotor: number;
  totalPengeluaran: number;
  labaBersih: number;
}

export interface PengeluaranBisnis {
  id: string;
  tanggal: string;
  kategori: string;
  keterangan: string;
  nominal: number;
}

export const useDompet = () => {
  const [stats, setStats] = useState<DompetStats>({
    totalPemasukan: 0,
    labaKotor: 0,
    totalPengeluaran: 0,
    labaBersih: 0
  });
  const [expenses, setExpenses] = useState<PengeluaranBisnis[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDompetData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch Stats
      const statsUrl = new URL(SCRIPT_URL, window.location.href);
      statsUrl.searchParams.append('action', 'getDompetStats');
      const statsRes = await fetch(statsUrl.toString());
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch Expenses
      const expUrl = new URL(SCRIPT_URL, window.location.href);
      expUrl.searchParams.append('action', 'getPengeluaranBisnis');
      const expRes = await fetch(expUrl.toString());
      const expData = await expRes.json();
      setExpenses(expData.data || []);
      
    } catch (error) {
      console.error('Error fetching dompet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async (formData: { kategori: string, keterangan: string, nominal: number, tanggal?: string }) => {
    try {
      setIsLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify({ 
          ...formData,
          action: 'addPengeluaranBisnis' 
        }),
      });
      toast.success('Pengeluaran berhasil dicatat!');
      fetchDompetData();
      return true;
    } catch (error) {
      toast.error('Gagal mencatat pengeluaran');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDompetData();
  }, []);

  return { stats, expenses, isLoading, fetchDompetData, addExpense };
};
