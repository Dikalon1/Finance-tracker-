import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCards: React.FC = () => {
  const { totalBalance, totalIncome, totalExpense } = useFinance();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Wallet size={24} />
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Balance</span>
        </div>
        <div className="text-3xl font-bold text-slate-900">{totalBalance.toLocaleString()} ₸</div>
        <p className="text-sm text-slate-500 mt-1">Across all accounts</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Income</span>
        </div>
        <div className="text-3xl font-bold text-green-600">+{totalIncome.toLocaleString()} ₸</div>
        <p className="text-sm text-slate-500 mt-1">This month</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <TrendingDown size={24} />
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Expenses</span>
        </div>
        <div className="text-3xl font-bold text-red-600">-{totalExpense.toLocaleString()} ₸</div>
        <p className="text-sm text-slate-500 mt-1">This month</p>
      </div>
    </div>
  );
};

export default SummaryCards;
