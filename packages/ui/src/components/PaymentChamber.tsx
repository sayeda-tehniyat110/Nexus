import React, { useState } from 'react';

type Transaction = { id: string; amount: number; sender: string; receiver: string; status: 'Success' | 'Pending'; date: string; };

export default function PaymentChamber({ role }: { role: 'Investor' | 'Entrepreneur' }) {
  const [balance, setBalance] = useState(role === 'Investor' ? 50000 : 1200);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX101', amount: 5000, sender: 'Nexus Fund', receiver: 'You', status: 'Success', date: '2026-06-10' },
  ]);
  const [amountInput, setAmountInput] = useState('');

  const handleFundDeal = () => {
    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0) return alert("Sahi amount likhein!");
    
    if (role === 'Investor' && amt > balance) return alert("Wallet mein itne paise nahi hain!");

    // Simulate Transaction
    const newTx: Transaction = {
      id: 'TX' + Math.floor(Math.random() * 900 + 100),
      amount: amt,
      sender: role === 'Investor' ? 'You (Investor)' : 'Sponsor Alpha',
      receiver: role === 'Investor' ? 'Tech Startup' : 'You (Entrepreneur)',
      status: 'Success',
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTx, ...transactions]);
    setBalance(prev => role === 'Investor' ? prev - amt : prev + amt);
    setAmountInput('');
    alert(role === 'Investor' ? "Deal successfully fund ho gayi!" : "Funds receive ho gaye!");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl text-white space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="font-bold text-lg text-emerald-400 flex items-center gap-2">💰 Nexus Secure Wallet</h3>
        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
          ${balance.toLocaleString()}
        </span>
      </div>

      {/* Action Simulator */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
          {role === 'Investor' ? '💸 Fund an Entrepreneur' : '📥 Request Deal Funding'}
        </h4>
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Amount ($)" 
            value={amountInput}
            onChange={e => setAmountInput(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1"
          />
          <button onClick={handleFundDeal} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-md">
            {role === 'Investor' ? 'Fund Deal' : 'Simulate Deposit'}
          </button>
        </div>
      </div>

      {/* Transaction History Table */}
      <div>
        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Transaction History</p>
        <div className="max-h-36 overflow-y-auto text-xs space-y-2 pr-1">
          {transactions.map(tx => (
            <div key={tx.id} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900">
              <div>
                <p className="font-semibold text-slate-200">${tx.amount} <span className="text-[10px] text-slate-500">({tx.id})</span></p>
                <p className="text-[10px] text-slate-400">{tx.sender} ➜ {tx.receiver}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-medium">{tx.status}</span>
                <p className="text-[9px] text-slate-500 mt-0.5">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}