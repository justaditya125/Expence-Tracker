import { useState, useEffect } from 'react';
import { Expense, Category, ExpenseSummary, FilterOptions, ExpenseType } from '@/types/expense';

const API_BASE_URL = 'https://backend-expense-tracker-4t83.onrender.com/api/expenses'; // Your backend API base URL

const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    dateRange: 'all'
  });

  // Fetch expenses from the backend on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        // Optionally, show a toast notification for error
      }
    };

    fetchExpenses();
  }, []); // Empty dependency array means this runs once on mount

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newExpense = await response.json();
      setExpenses(prev => [newExpense, ...prev]);
    } catch (error) {
      console.error("Error adding expense:", error);
      // Optionally, show a toast notification for error
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Assuming the backend sends back the updated expense or success message
      // Re-fetch all expenses to ensure consistency, or update locally if backend sends full updated object
      const updatedData = await response.json(); // Assuming backend sends back the updated object
      console.log("Updated expense data from backend:", updatedData);
      setExpenses(prev => 
        prev.map(expense => 
          expense._id === id ? { ...expense, ...updates } : expense // Assuming _id from MongoDB
        )
      );

    } catch (error) {
      console.error("Error updating expense:", error);
      // Optionally, show a toast notification for error
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setExpenses(prev => prev.filter(expense => expense._id !== id)); // Assuming _id from MongoDB
    } catch (error) {
      console.error("Error deleting expense:", error);
      // Optionally, show a toast notification for error
    }
  };

  const getFilteredExpenses = (): Expense[] => {
    let filtered = [...expenses];

    // Filter by category
    if (filters.category !== 'All') {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }

    // Filter by date range
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    switch (filters.dateRange) {
      case 'today':
        filtered = filtered.filter(expense => 
          new Date(expense.date) >= today
        );
        break;
      case 'week':
        filtered = filtered.filter(expense => 
          new Date(expense.date) >= weekAgo
        );
        break;
      case 'month':
        filtered = filtered.filter(expense => 
          new Date(expense.date) >= monthAgo
        );
        break;
    }

    return filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const expenseValue = (expense: Expense) =>
    expense.type === 'Credit' ? expense.amount : -expense.amount;

  const getSummary = (): ExpenseSummary => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const dailyExpenses = expenses.filter(expense => 
      new Date(expense.date) >= today
    );
    const weeklyExpenses = expenses.filter(expense => 
      new Date(expense.date) >= weekAgo
    );
    const monthlyExpenses = expenses.filter(expense => 
      new Date(expense.date) >= monthAgo
    );

    return {
      daily: dailyExpenses.reduce((sum, expense) => sum + expenseValue(expense), 0),
      weekly: weeklyExpenses.reduce((sum, expense) => sum + expenseValue(expense), 0),
      monthly: monthlyExpenses.reduce((sum, expense) => sum + expenseValue(expense), 0),
      total: expenses.reduce((sum, expense) => sum + expenseValue(expense), 0)
    };
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Title', 'Category', 'Type', 'Amount (INR)'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(expense => 
        [
          expense.date,
          expense.title,
          expense.category,
          expense.type,
          expense.amount
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    expenses: getFilteredExpenses(),
    allExpenses: expenses,
    filters,
    setFilters,
    addExpense,
    updateExpense,
    deleteExpense,
    getSummary,
    exportToCSV
  };
};

export default useExpenses;
