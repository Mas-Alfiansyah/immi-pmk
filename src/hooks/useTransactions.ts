import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const SCRIPT_ID = 'AKfycbwNqK5eLUc5N2DOCCTIoodxCKQbAVwRkfIW6rUclteh_QKRrw1JPcGOPUVbK_54hf3_qw';
const SCRIPT_URL = import.meta.env.DEV 
  ? `/google-api/macros/s/${SCRIPT_ID}/exec`
  : `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export interface TransactionBisnis {
  id: string;
  tanggal: string;
  seller: string;
  barang: string;
  varian: string;
  jumlah: number;
  harga_beli: number;
  laba: number;
  harga_jual: number;
  subtotal_laba: number;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionBisnis[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const url = new URL(SCRIPT_URL, window.location.href);
      url.searchParams.append('action', 'getTransaksiBisnis');
      const response = await fetch(url.toString());
      const data = await response.json();
      setTransactions(data.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (items: any[], seller: string) => {
    try {
      setIsLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify({ 
          items,
          seller,
          action: 'addTransaksiBisnis' 
        }),
      });
      toast.success('Transaksi berhasil disimpan!');
      return true;
    } catch (error) {
      toast.error('Gagal menyimpan transaksi');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return { transactions, isLoading, fetchTransactions, addTransaction };
};
