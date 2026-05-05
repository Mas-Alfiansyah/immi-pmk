import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  X, 
  Save, 
  Loader2,
  Tag,
  Layers
} from 'lucide-react';

interface Variant {
  nama: string;
  hargaBeli: number;
  laba: number;
  hargaJual: number;
  stok: number;
}

interface Product {
  id: string;
  nama: string;
  kategori: string;
  variants: Variant[];
}

export const BarangModule = () => {
  const [products, setProducts] = useState<Product[]>([
    { 
      id: '1', 
      nama: 'Kaos IMMI Exclusive', 
      kategori: 'Merchandise', 
      variants: [
        { nama: 'Ukuran L', hargaBeli: 50000, laba: 25000, hargaJual: 75000, stok: 10 },
        { nama: 'Ukuran XL', hargaBeli: 55000, laba: 25000, hargaJual: 80000, stok: 5 }
      ] 
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    nama: '',
    kategori: 'Umum',
    variants: [{ nama: 'Default', hargaBeli: 0, laba: 0, hargaJual: 0, stok: 0 }]
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nama: product.nama,
        kategori: product.kategori,
        variants: [...product.variants]
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nama: '',
        kategori: 'Umum',
        variants: [{ nama: 'Default', hargaBeli: 0, laba: 0, hargaJual: 0, stok: 0 }]
      });
    }
    setIsModalOpen(true);
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { nama: '', hargaBeli: 0, laba: 0, hargaJual: 0, stok: 0 }]
    }));
  };

  const handleRemoveVariant = (index: number) => {
    if (formData.variants.length === 1) return;
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    setFormData(prev => {
      const newVariants = [...prev.variants];
      const variant = { ...newVariants[index], [field]: value };
      
      // Auto-calculate logic
      if (field === 'hargaBeli' || field === 'laba') {
        variant.hargaJual = Number(variant.hargaBeli || 0) + Number(variant.laba || 0);
      } else if (field === 'hargaJual') {
        variant.laba = Number(variant.hargaJual || 0) - Number(variant.hargaBeli || 0);
      }
      
      newVariants[index] = variant;
      return { ...prev, variants: newVariants };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
      } else {
        const newProduct: Product = {
          id: Math.random().toString(36).substr(2, 9),
          ...formData
        };
        setProducts(prev => [...prev, newProduct]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const filteredProducts = products.filter(p => 
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari barang atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={16} /> Tambah Barang
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div 
            key={product.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-50">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                  <Package size={24} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(product)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => setProducts(prev => prev.filter(p => p.id !== product.id))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter leading-tight mb-1">{product.nama}</h4>
              <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest">{product.kategori}</span>
            </div>
            <div className="p-6 bg-slate-50/50 flex-1 space-y-3">
              {product.variants.map((v, i) => (
                <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{v.nama || 'Utama'}</span>
                    <span className="text-sm font-black text-indigo-600 tracking-tight">{formatCurrency(v.hargaJual)}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] font-black text-emerald-500 uppercase tracking-widest">Laba: {formatCurrency(v.laba)}</span>
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Stok: {v.stok}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="relative w-full max-w-2xl bg-white rounded-xl p-10 shadow-3xl overflow-hidden max-h-[90vh] flex flex-col" >
              <div className="flex items-center justify-between mb-8 flex-shrink-0">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">{editingProduct ? 'Edit Barang' : 'Tambah Barang'}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Kelola Inventaris & Pengaturan Harga</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="bg-slate-50 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                <div className="">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Barang</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="text" required value={formData.nama} onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))} className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800" placeholder="Nama produk..." />
                    </div>
                  </div>
                  {/* <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kategori</label>
                    <input type="text" value={formData.kategori} onChange={(e) => setFormData(prev => ({ ...prev, kategori: e.target.value }))} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800" placeholder="Contoh: Merchandise" />
                  </div> */}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Layers size={14} className="text-indigo-600" /> Varian & Harga
                    </h5>
                    {/* <button type="button" onClick={handleAddVariant} className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center gap-1 bg-indigo-50 px-3 py-1 rounded-xl transition-all">
                      <Plus size={12} /> Tambah Varian
                    </button> */}
                  </div>

                  <div className="space-y-4">
                    {formData.variants.map((v, i) => (
                      <div key={i} className="p-6 rounded-xl border border-slate-100 bg-slate-50/30 relative group">
                        <button type="button" onClick={() => handleRemoveVariant(i)} className="absolute -top-2 -right-2 bg-white text-rose-500 p-1 rounded-xl border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={14} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Nama Varian</label>
                            <input type="text" value={v.nama} onChange={(e) => handleVariantChange(i, 'nama', e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800" placeholder="Misal: Ukuran XL" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stok Awal</label>
                            <input type="number" value={v.stok} onChange={(e) => handleVariantChange(i, 'stok', Number(e.target.value))} className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Harga Beli</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300">Rp</span>
                              <input type="number" value={v.hargaBeli} onChange={(e) => handleVariantChange(i, 'hargaBeli', Number(e.target.value))} className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Laba (Keuntungan)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-emerald-300">Rp</span>
                              <input type="number" value={v.laba} onChange={(e) => handleVariantChange(i, 'laba', Number(e.target.value))} className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-50 border border-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">Harga Jual Akhir</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-indigo-300">Rp</span>
                              <input type="number" value={v.hargaJual} onChange={(e) => handleVariantChange(i, 'hargaJual', Number(e.target.value))} className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-50 border border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>

              <div className="pt-6 mt-auto border-t border-slate-50 flex-shrink-0">
                <button type="submit" onClick={handleSave} disabled={isLoading} className="w-full py-5 bg-indigo-600 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:translate-y-[-2px] active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-70" >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  {editingProduct ? 'UPDATE PRODUK' : 'SIMPAN PRODUK'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
