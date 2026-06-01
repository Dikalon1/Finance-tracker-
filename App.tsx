import { useState } from 'react';
import Sidebar from './components/UI/Sidebar';
import { FinanceProvider } from './context/FinanceContext';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionList from './components/Transactions/TransactionList';
import AccountList from './components/Accounts/AccountList';
import CategoryList from './components/Categories/CategoryList';
import Reports from './components/Analytics/Reports';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Transaction History</h1>
            <TransactionList />
          </div>
        );
      case 'accounts':
        return <AccountList />;
      case 'categories':
        return <CategoryList />;
      case 'analytics':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </FinanceProvider>
  );
}

export default App;
