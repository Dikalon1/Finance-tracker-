import SummaryCards from './SummaryCards';
import TransactionList from '../Transactions/TransactionList';
import TransactionForm from '../Transactions/TransactionForm';
import { useState } from 'react';
import { Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here's your financial summary.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      <SummaryCards />

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <TransactionForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
        </div>
        <TransactionList />
      </div>
    </div>
  );
};

export default Dashboard;
