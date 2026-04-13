import { Wallet } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass mb-8">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-200">
            <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent uppercase tracking-tighter">
            AlKas
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest border border-primary-100">
            Ver 2.0
          </div>
        </div>
      </div>
    </header>
  );
};
