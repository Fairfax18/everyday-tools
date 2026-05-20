'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar ($)', locale: 'en-US' },
  { code: 'IDR', label: 'Indonesian Rupiah (Rp)', locale: 'id-ID' },
  { code: 'EUR', label: 'Euro (€)', locale: 'en-DE' },
  { code: 'GBP', label: 'British Pound (£)', locale: 'en-GB' },
  { code: 'JPY', label: 'Japanese Yen (¥)', locale: 'ja-JP' },
  { code: 'AUD', label: 'Australian Dollar ($)', locale: 'en-AU' },
  { code: 'SGD', label: 'Singapore Dollar ($)', locale: 'en-SG' },
];

export default function SplitBill() {
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [tax, setTax] = useState('');
  const [tip, setTip] = useState('');
  
  const [people, setPeople] = useState([
    { id: '1', name: 'Person 1' },
    { id: '2', name: 'Person 2' }
  ]);
  
  const [items, setItems] = useState([
    { id: Date.now().toString(), name: '', price: '', assignees: ['1', '2'] }
  ]);

  // --- Helpers ---
  const formatMoney = (amount) => {
    const isZeroDecimal = ['IDR', 'JPY'].includes(currency.code);
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2,
    }).format(amount || 0);
  };

  // --- People Management ---
  const addPerson = () => {
    const newId = Date.now().toString();
    setPeople([...people, { id: newId, name: `Person ${people.length + 1}` }]);
  };

  const updatePerson = (id, name) => {
    setPeople(people.map(p => p.id === id ? { ...p, name } : p));
  };

  const removePerson = (id) => {
    if (people.length <= 1) return;
    setPeople(people.filter(p => p.id !== id));
    // Remove person from all items
    setItems(items.map(item => ({
      ...item,
      assignees: item.assignees.filter(a => a !== id)
    })));
  };

  // --- Item Management ---
  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', price: '', assignees: people.map(p => p.id) }]);
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const toggleAssignee = (itemId, personId) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const has = item.assignees.includes(personId);
        const newAssignees = has ? item.assignees.filter(id => id !== personId) : [...item.assignees, personId];
        return { ...item, assignees: newAssignees };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // --- Math Engine ---
  const breakdown = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const totalTax = parseFloat(tax) || 0;
    const totalTip = parseFloat(tip) || 0;
    const grandTotal = subtotal + totalTax + totalTip;

    const personTotals = people.map(p => {
      let personSub = 0;
      items.forEach(item => {
        if (item.assignees.includes(p.id)) {
          personSub += (parseFloat(item.price) || 0) / item.assignees.length;
        }
      });
      
      // Proportional math: If you bought 50% of the food, you pay 50% of the tax and tip.
      const proportion = subtotal > 0 ? personSub / subtotal : 0;
      const personTax = totalTax * proportion;
      const personTip = totalTip * proportion;
      const personTotal = personSub + personTax + personTip;

      return { ...p, subtotal: personSub, tax: personTax, tip: personTip, total: personTotal };
    });

    return { subtotal, grandTotal, personTotals };
  }, [items, people, tax, tip]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Itemized Split Bill</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Calculate exactly who owes what, including proportional tax and tip.</p>
        </div>
        
        {/* Currency Selector */}
        <div className="w-full md:w-48">
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Currency</label>
          <select 
            value={currency.code}
            onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value))}
            className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition"
          >
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Data Entry */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* People Section */}
          <section className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">1. Who is paying?</h2>
              <button onClick={addPerson} className="text-sm font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">+ Add Person</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <AnimatePresence>
                {people.map(p => (
                  <motion.div key={p.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative group">
                    <input 
                      type="text" value={p.name} onChange={(e) => updatePerson(p.id, e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition text-sm font-medium"
                    />
                    {people.length > 1 && (
                      <button onClick={() => removePerson(p.id)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-100 text-red-600 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white">×</button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Items Section */}
          <section className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">2. What did you order?</h2>
              <button onClick={addItem} className="text-sm font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">+ Add Item</button>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="p-4 border border-neutral-100 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/30 rounded-xl group relative">
                    <div className="flex gap-3 mb-3">
                      <input 
                        type="text" placeholder={`Item ${index + 1}`} value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="flex-1 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition text-sm"
                      />
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm">{currency.code === 'IDR' || currency.code === 'JPY' ? currency.label.match(/\((.*?)\)/)[1] : '$'}</span>
                        <input 
                          type="number" placeholder="0.00" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                          className={`w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition text-sm ${['IDR', 'JPY'].includes(currency.code) ? 'pl-10' : 'pl-7'}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Shared By:</p>
                      <div className="flex flex-wrap gap-2">
                        {people.map(p => {
                          const isAssigned = item.assignees.includes(p.id);
                          return (
                            <button 
                              key={p.id} onClick={() => toggleAssignee(item.id, p.id)}
                              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${isAssigned ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-black shadow-sm' : 'bg-white border-neutral-200 text-neutral-500 dark:bg-[#111] dark:border-neutral-800 dark:text-neutral-400 hover:border-neutral-400'}`}
                            >
                              {p.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white">×</button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Receipt Totals Section */}
          <section className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h2 className="text-lg font-bold mb-4">3. Receipt Totals</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Total Tax</label>
                <input 
                  type="number" placeholder="0.00" value={tax} onChange={(e) => setTax(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition font-mono text-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Total Tip</label>
                <input 
                  type="number" placeholder="0.00" value={tip} onChange={(e) => setTip(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition font-mono text-lg"
                />
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Breakdown Results */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-6 md:p-8 rounded-3xl sticky top-8 shadow-xl">
            <h2 className="text-xl font-bold mb-6 border-b border-neutral-800 dark:border-neutral-200 pb-4">Who Owes What</h2>
            
            <div className="space-y-4 mb-8">
              {breakdown.personTotals.map(p => (
                <div key={p.id} className="flex justify-between items-center group">
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                      Food: {formatMoney(p.subtotal)} • Tax/Tip: {formatMoney(p.tax + p.tip)}
                    </p>
                  </div>
                  <div className="font-mono text-lg font-bold tabular-nums group-hover:scale-105 transition-transform">
                    {formatMoney(p.total)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-800 dark:border-neutral-200 pt-6 space-y-2">
              <div className="flex justify-between text-sm text-neutral-400 dark:text-neutral-500">
                <span>Subtotal</span>
                <span className="font-mono">{formatMoney(breakdown.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-400 dark:text-neutral-500">
                <span>Tax & Tip</span>
                <span className="font-mono">{formatMoney((parseFloat(tax) || 0) + (parseFloat(tip) || 0))}</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="font-bold">Grand Total</span>
                <span className="font-mono text-3xl font-extrabold tracking-tighter tabular-nums">{formatMoney(breakdown.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}