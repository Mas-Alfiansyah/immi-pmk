import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Edit2, 
  Trash2, 
  UserPlus, 
  X, 
  Save, 
  Loader2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

import { useSellers, type Seller } from '../../hooks/useSellers';

export const SellerModule = () => {
  const { sellers, isLoading: isFetching, addSeller, updateSeller, deleteSeller } = useSellers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    nama: string;
    kontak: string;
    email: string;
    alamat: string;
    status: 'aktif' | 'nonaktif';
  }>({
    nama: '',
    kontak: '',
    email: '',
    alamat: '',
    status: 'aktif'
  });

  const handleOpenModal = (seller?: Seller) => {
    if (seller) {
      setEditingSeller(seller);
      setFormData({
        nama: seller.nama,
        kontak: seller.kontak,
        email: seller.email,
        alamat: seller.alamat,
        status: seller.status
      });
    } else {
      setEditingSeller(null);
      setFormData({
        nama: '',
        kontak: '',
        email: '',
        alamat: '',
        status: 'aktif'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingSeller) {
        await updateSeller(editingSeller.id, formData);
      } else {
        await addSeller(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus seller ini?')) {
      await deleteSeller(id);
    }
  };

  const filteredSellers = (sellers || []).filter(s => 
    (s.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.kontak || '').includes(searchTerm)
  );

  const isLoading = isFetching || isSubmitting;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama atau kontak seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <UserPlus size={16} /> Tambah Seller
        </button>
      </div>

      {/* Seller Table */}
      <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Info Seller</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Kontak</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Alamat</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Tidak ada seller ditemukan
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6">
                      <div className="font-black text-slate-800 uppercase tracking-tight">{seller.nama}</div>
                      <div className="text-[10px] font-bold text-slate-400 lowercase">{seller.email}</div>
                    </td>
                    <td className="py-5 px-6 font-bold text-slate-600 text-sm">{seller.kontak}</td>
                    <td className="py-5 px-6 font-bold text-slate-600 text-sm max-w-[200px] truncate">{seller.alamat}</td>
                    <td className="py-5 px-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        seller.status === 'aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {seller.status}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(seller)}
                          className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(seller.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-10 shadow-3xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                    {editingSeller ? 'Edit Seller' : 'Tambah Seller'}
                  </h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lengkapi Informasi Bisnis Seller</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="bg-slate-50 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Bisnis / Seller</label>
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
                      placeholder="Contoh: Toko Berkah"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">WhatsApp / Kontak</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                          type="tel"
                          required
                          value={formData.kontak}
                          onChange={(e) => setFormData(prev => ({ ...prev, kontak: e.target.value }))}
                          className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
                          placeholder="08..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
                          placeholder="seller@mail.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Alamat Kantor / Toko</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                      <textarea
                        value={formData.alamat}
                        onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
                        className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800 min-h-[100px]"
                        placeholder="Jl. Raya Utama..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Status Kemitraan</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Non-Aktif</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-indigo-600 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:translate-y-[-2px] active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  {editingSeller ? 'UPDATE SELLER' : 'SIMPAN SELLER'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
