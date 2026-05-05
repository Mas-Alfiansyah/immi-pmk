import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  CreditCard, 
  Receipt,
  Package,
  Minus,
  Loader2
} from 'lucide-react';
import { Combobox } from '../Combobox';
import { useSellers } from '../../hooks/useSellers';
import { useBarang } from '../../hooks/useBarang';
import { useTransactions } from '../../hooks/useTransactions';

interface CartItem {
  id: string;
  nama: string;
  varian: string;
  harga_beli: number;
  laba: number;
  harga_jual: number;
  jumlah: number;
  total: number;
}

export const TransaksiModule = () => {
  const { sellers, isLoading: isLoadingSellers } = useSellers();
  const { items: products, isLoading: isLoadingProducts } = useBarang();
  const { addTransaction, isLoading: isSubmitting } = useTransactions();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSeller, setSelectedSeller] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [jumlah, setJumlah] = useState(1);

  // Derive options for Combobox
  const sellerOptions = useMemo(() => sellers.map(s => s.nama), [sellers]);
  const productOptions = useMemo(() => {
    // Unique product names from the flat list of barang
    const names = products.map(p => p.nama_barang);
    return Array.from(new Set(names));
  }, [products]);
  
  const filteredProductsBySelectedName = useMemo(() => 
    products.filter(p => p.nama_barang === selectedProduct), 
  [products, selectedProduct]);

  const variantOptions = useMemo(() => 
    filteredProductsBySelectedName.map(p => p.varian), 
  [filteredProductsBySelectedName]);

  const currentVariant = useMemo(() => 
    filteredProductsBySelectedName.find(p => p.varian === selectedVariant), 
  [filteredProductsBySelectedName, selectedVariant]);

  const handleAddToCart = () => {
    if (!currentVariant) return;

    const existingItemIndex = cart.findIndex(
      item => item.id === currentVariant.id
    );

    if (existingItemIndex > -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].jumlah += jumlah;
      newCart[existingItemIndex].total = newCart[existingItemIndex].jumlah * newCart[existingItemIndex].harga_jual;
      setCart(newCart);
    } else {
      const newItem: CartItem = {
        id: currentVariant.id,
        nama: currentVariant.nama_barang,
        varian: currentVariant.varian,
        harga_beli: currentVariant.harga_beli,
        laba: currentVariant.laba,
        harga_jual: currentVariant.harga_jual,
        jumlah: jumlah,
        total: currentVariant.harga_jual * jumlah
      };
      setCart([...cart, newItem]);
    }

    // Reset inputs
    setJumlah(1);
    setSelectedVariant('');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    if (cart.length === 0 || !selectedSeller) return;
    const success = await addTransaction(cart, selectedSeller);
    if (success) {
      setCart([]);
      setSelectedSeller('');
      setSelectedProduct('');
      setSelectedVariant('');
    }
  };

  const totalBayar = cart.reduce((acc, item) => acc + item.total, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const isLoading = isLoadingSellers || isLoadingProducts || isSubmitting;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <ShoppingCart size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Input Transaksi</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pilih Seller / Penanggung Jawab</label>
              <Combobox 
                options={sellerOptions} 
                value={selectedSeller} 
                onChange={setSelectedSeller}
                placeholder="Cari nama seller..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pilih Produk</label>
              <Combobox 
                options={productOptions} 
                value={selectedProduct} 
                onChange={(val) => {
                  setSelectedProduct(val);
                  setSelectedVariant(''); // Reset variant when product changes
                }}
                placeholder="Cari produk..."
              />
            </div>

            {selectedProduct && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pilih Varian</label>
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
                >
                  <option value="">-- Pilih Varian --</option>
                  {variantOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Jumlah</label>
                <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                    className="p-4 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    value={jumlah}
                    onChange={(e) => setJumlah(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-transparent text-center font-black text-slate-800 focus:outline-none"
                  />
                  <button 
                    onClick={() => setJumlah(jumlah + 1)}
                    className="p-4 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Harga Satuan</label>
                <div className="px-6 py-4 rounded-xl bg-slate-100 border border-slate-200 font-black text-slate-500">
                  {currentVariant ? formatCurrency(currentVariant.harga_jual) : 'Rp 0'}
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedProduct || !selectedVariant || isLoading}
              className="w-full py-5 bg-indigo-600 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:translate-y-[-2px] active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
            >
              <Plus size={20} /> TAMBAH KE DAFTAR
            </button>
          </div>
        </div>

        {/* Quick Stats or Total Card */}
        <div className="bg-indigo-900 rounded-xl p-8 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <CreditCard size={160} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Total Pembayaran</p>
          <h3 className="text-4xl font-black tracking-tighter mb-8">{formatCurrency(totalBayar)}</h3>
          
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || !selectedSeller || isLoading}
            className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black text-lg shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
            BAYAR SEKARANG
          </button>
          {!selectedSeller && cart.length > 0 && (
            <p className="mt-4 text-[10px] text-center font-bold text-rose-300 uppercase tracking-widest">Silakan pilih seller terlebih dahulu</p>
          )}
        </div>
      </div>

      {/* Cart/List Section */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden h-full flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Receipt size={20} className="text-slate-400" />
              </div>
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Daftar Belanja</h3>
            </div>
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {cart.length} Item
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <div className="bg-slate-100 p-6 rounded-full">
                  <Package size={48} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-black uppercase tracking-widest text-sm">Belum ada item</p>
                  <p className="text-xs font-bold">Pilih produk di samping untuk memulai transaksi</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {cart.map((item, idx) => (
                    <motion.div
                      key={`${item.id}-${item.varian}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between bg-slate-50 p-6 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <Package size={20} className="text-indigo-500" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{item.nama}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.varian}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Qty</p>
                          <p className="font-black text-slate-800">x {item.jumlah}</p>
                        </div>
                        <div className="text-right w-32">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Subtotal</p>
                          <p className="font-black text-indigo-600 tracking-tight">{formatCurrency(item.total)}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(idx)}
                          className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-8 bg-slate-50 border-t border-slate-100">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Metode Pembayaran</p>
                  <div className="flex gap-2">
                    <span className="px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Tunai / Cash</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Transaksi</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(totalBayar)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
