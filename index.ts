export type TransactionType = 'expense' | 'income';

export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  subCategories: SubCategory[];
  icon?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  subCategoryId?: string;
  accountId: string;
  date: string;
  note: string;
}

export type Period = 'day' | 'week' | 'month' | 'year' | 'all';
