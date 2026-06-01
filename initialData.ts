import type { Category, Account } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Groceries',
    type: 'expense',
    subCategories: [
      { id: '1-1', name: 'Supermarket' },
      { id: '1-2', name: 'Fruit & Veg' },
    ],
  },
  {
    id: '2',
    name: 'Transport',
    type: 'expense',
    subCategories: [
      { id: '2-1', name: 'Fuel' },
      { id: '2-2', name: 'Public Transport' },
      { id: '2-3', name: 'Taxi' },
    ],
  },
  {
    id: '3',
    name: 'Dining Out',
    type: 'expense',
    subCategories: [
      { id: '3-1', name: 'Restaurants' },
      { id: '3-2', name: 'Coffee' },
    ],
  },
  {
    id: '4',
    name: 'Salary',
    type: 'income',
    subCategories: [
      { id: '4-1', name: 'Main Job' },
      { id: '4-2', name: 'Freelance' },
    ],
  },
];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: 'Cash',
    balance: 0,
    color: '#4ade80',
  },
  {
    id: 'acc-2',
    name: 'Kaspi Bank',
    balance: 0,
    color: '#f87171',
  },
];
