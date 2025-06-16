// Added type field to Expense type and updated relevant definitions

export type ExpenseType = 'Credit' | 'Debit';

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
  createdAt: string;
  type: ExpenseType; // Added
}

export type Category = 
  | 'Food'
  | 'Transport'
  | 'Utilities'
  | 'Entertainment'
  | 'Healthcare'
  | 'Shopping'
  | 'Education'
  | 'Other';

export interface ExpenseSummary {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
}

export interface FilterOptions {
  category: Category | 'All';
  dateRange: 'all' | 'today' | 'week' | 'month';
}
