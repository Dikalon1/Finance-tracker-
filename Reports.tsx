import React, { useMemo, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const Reports: React.FC = () => {
  const { transactions, categories } = useFinance();
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('30d');

  const filteredTransactions = useMemo(() => {
    if (period === 'all') return transactions;
    
    const now = new Date();
    const startDate = period === '7d' ? subDays(now, 7) : subDays(now, 30);
    
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d >= startOfDay(startDate);
    });
  }, [transactions, period]);

  const expenseByCategory = useMemo(() => {
    const data: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const catName = categories.find(c => c.id === t.categoryId)?.name || 'Other';
        data[catName] = (data[catName] || 0) + t.amount;
      });
    
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions, categories]);

  const dailyTrend = useMemo(() => {
    const data: Record<string, { date: string, income: number, expense: number }> = {};
    
    // Last 7 or 30 days
    const days = period === 'all' ? 30 : (period === '7d' ? 7 : 30);
    for (let i = days - 1; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'MMM d');
      data[d] = { date: d, income: 0, expense: 0 };
    }

    filteredTransactions.forEach(t => {
      const d = format(new Date(t.date), 'MMM d');
      if (data[d]) {
        if (t.type === 'income') data[d].income += t.amount;
        else data[d].expense += t.amount;
      }
    });

    return Object.values(data);
  }, [filteredTransactions, period]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Financial Analysis</h2>
        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
          {(['7d', '30d', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                period === p ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Structure */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Expense Structure</h3>
          <div className="h-[300px] w-full">
            {expenseByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    // @ts-expect-error formatter value type is too complex for basic TS in this environment
                    formatter={(value: number | string) => [`${Number(value).toLocaleString()} ₸`, 'Amount']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No expense data for this period
              </div>
            )}
          </div>
        </div>

        {/* Income vs Expense Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Income vs Expense</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  // @ts-expect-error formatter value type is too complex for basic TS in this environment
                  formatter={(value: number | string) => `${Number(value).toLocaleString()} ₸`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
