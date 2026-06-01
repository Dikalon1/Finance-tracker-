import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Account, Category, Transaction } from '../types';
import { INITIAL_ACCOUNTS, INITIAL_CATEGORIES } from '../constants/initialData';

interface FinanceContextType {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  addSubCategory: (categoryId: string, subCategory: Omit<import('../types').SubCategory, 'id'>) => void;
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

/* eslint-disable react-refresh/only-export-components */
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('finance_accounts');
    return saved ? JSON.parse(saved) as Account[] : INITIAL_ACCOUNTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('finance_categories');
    return saved ? JSON.parse(saved) as Category[] : INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) as Transaction[] : [];
  });

  useEffect(() => {
    localStorage.setItem('finance_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('finance_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: crypto.randomUUID() };
    setTransactions(prev => [newTransaction, ...prev]);

    // Update account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === t.accountId) {
        const amount = Number(t.amount);
        return {
          ...acc,
          balance: t.type === 'income' ? acc.balance + amount : acc.balance - amount
        };
      }
      return acc;
    }));
  };

  const deleteTransaction = (id: string) => {
    const t = transactions.find(tx => tx.id === id);
    if (!t) return;

    setTransactions(prev => prev.filter(tx => tx.id !== id));

    // Revert account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === t.accountId) {
        const amount = Number(t.amount);
        return {
          ...acc,
          balance: t.type === 'income' ? acc.balance - amount : acc.balance + amount
        };
      }
      return acc;
    }));
  };

  const addAccount = (acc: Omit<Account, 'id'>) => {
    const newAccount = { ...acc, id: crypto.randomUUID() };
    setAccounts(prev => [...prev, newAccount]);
  };

  const updateAccount = (acc: Account) => {
    setAccounts(prev => prev.map(a => a.id === acc.id ? acc : a));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCategory = { ...cat, id: crypto.randomUUID() };
    setCategories(prev => [...prev, newCategory]);
  };

  const addSubCategory = (categoryId: string, sub: Omit<import('../types').SubCategory, 'id'>) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subCategories: [...cat.subCategories, { ...sub, id: crypto.randomUUID() }]
        };
      }
      return cat;
    }));
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <FinanceContext.Provider value={{
      accounts,
      categories,
      transactions,
      addTransaction,
      deleteTransaction,
      addAccount,
      updateAccount,
      deleteAccount,
      addCategory,
      addSubCategory,
      totalBalance,
      totalIncome,
      totalExpense
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
