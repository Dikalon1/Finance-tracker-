import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CreditCard, Plus, Trash2 } from 'lucide-react';

const AccountList: React.FC = () => {
  const { accounts, deleteAccount, addAccount } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccBalance, setNewAccBalance] = useState('');
  const [newAccColor, setNewAccColor] = useState('#3b82f6');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName) return;
    addAccount({
      name: newAccName,
      balance: Number(newAccBalance) || 0,
      color: newAccColor,
    });
    setNewAccName('');
    setNewAccBalance('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">My Accounts & Cards</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Account</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Name</label>
              <input
                type="text"
                value={newAccName}
                onChange={(e) => setNewAccName(e.target.value)}
                placeholder="e.g. Halyk Bank"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Initial Balance (₸)</label>
              <input
                type="number"
                value={newAccBalance}
                onChange={(e) => setNewAccBalance(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
              <input
                type="color"
                value={newAccColor}
                onChange={(e) => setNewAccColor(e.target.value)}
                className="w-full h-10 p-1 border border-slate-300 rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Account
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group"
          >
            <div
              className="absolute top-0 left-0 w-2 h-full"
              style={{ backgroundColor: account.color }}
            />
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{account.name}</h3>
                  <p className="text-sm text-slate-500">Card / Account</p>
                </div>
              </div>
              <button
                onClick={() => deleteAccount(account.id)}
                className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="mt-6">
              <div className="text-3xl font-bold text-slate-900">
                {account.balance.toLocaleString()} ₸
              </div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Current Balance
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountList;
