import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Trash2, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const TransactionList: React.FC = () => {
  const { transactions, categories, accounts, deleteTransaction } = useFinance();

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';
  const getSubCategoryName = (catId: string, subId?: string) => {
    if (!subId) return '';
    const cat = categories.find(c => c.id === catId);
    return cat?.subCategories.find(s => s.id === subId)?.name || '';
  };
  const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'Unknown';

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
          <Calendar size={32} />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No transactions yet</h3>
        <p className="text-slate-500 mt-1">Start by adding your first expense or income.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Note</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {format(new Date(t.date), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{getCategoryName(t.categoryId)}</span>
                    {t.subCategoryId && (
                      <span className="text-xs text-slate-500">{getSubCategoryName(t.categoryId, t.subCategoryId)}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {getAccountName(t.accountId)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                  {t.note || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`flex items-center justify-end font-bold ${
                    t.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {t.type === 'income' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownLeft size={14} className="mr-1" />}
                    {t.amount.toLocaleString()} ₸
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
