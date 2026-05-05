import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const SCRIPT_ID = 'AKfycbwNqK5eLUc5N2DOCCTIoodxCKQbAVwRkfIW6rUclteh_QKRrw1JPcGOPUVbK_54hf3_qw';
const SCRIPT_URL = import.meta.env.DEV 
  ? `/google-api/macros/s/${SCRIPT_ID}/exec`
  : `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export interface Seller {
  id: string;
  nama: string;
  kontak: string;
  email: string;
  alamat: string;
  status: 'aktif' | 'nonaktif';
}

export const useSellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSellers = async () => {
    try {
      setIsLoading(true);
      const url = new URL(SCRIPT_URL, window.location.href);
      url.searchParams.append('action', 'getSellers');

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.error) {
        setSellers([]);
        return;
      }
      
      // Map backend 'telepon' to frontend 'kontak'
      const mappedSellers: Seller[] = (data.data || []).map((s: any) => ({
        id: s.id,
        nama: s.nama,
        kontak: s.telepon,
        email: s.email,
        alamat: s.alamat,
        status: s.status.toLowerCase() as 'aktif' | 'nonaktif'
      }));
      
      setSellers(mappedSellers);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Gagal memuat data seller');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const addSeller = async (formData: Omit<Seller, 'id'>) => {
    try {
      setIsLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify({ 
          ...formData, 
          telepon: formData.kontak, // Map back for backend
          action: 'addSeller' 
        }),
      });
      toast.success('Seller berhasil ditambahkan!');
      setTimeout(fetchSellers, 1500); 
    } catch (error) {
      toast.error('Gagal menambah seller');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSeller = async (id: string, formData: Omit<Seller, 'id'>) => {
    try {
      setIsLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify({ 
          ...formData, 
          id,
          telepon: formData.kontak, // Map back for backend
          action: 'updateSeller' 
        }),
      });
      toast.success('Data seller berhasil diperbarui!');
      setTimeout(fetchSellers, 1500); 
    } catch (error) {
      toast.error('Gagal memperbarui seller');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSeller = async (id: string) => {
    try {
      setIsLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: import.meta.env.DEV ? 'cors' : 'no-cors',
        body: JSON.stringify({ 
          id,
          action: 'deleteSeller' 
        }),
      });
      toast.success('Seller berhasil dihapus!');
      setTimeout(fetchSellers, 1500); 
    } catch (error) {
      toast.error('Gagal menghapus seller');
    } finally {
      setIsLoading(false);
    }
  };

  return { sellers, isLoading, fetchSellers, addSeller, updateSeller, deleteSeller };
};
