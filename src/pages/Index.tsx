import React, { useState, useEffect } from 'react';
import useExpenses from '@/hooks/useExpenses';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseSummary } from '@/components/ExpenseSummary';
import { ExpenseFilters } from '@/components/ExpenseFilters';
import { ExpenseChart } from '@/components/ExpenseChart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BarChart3, List, Home, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Expense } from '@/types/expense';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const { toast } = useToast();
  
  // Ensure dark theme is enabled globally
  useEffect(() => {
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const {
    expenses,
    allExpenses,
    filters,
    setFilters,
    addExpense,
    updateExpense,
    deleteExpense,
    getSummary,
    exportToCSV
  } = useExpenses();

  const handleAddExpense = (expense: Parameters<typeof addExpense>[0]) => {
    addExpense(expense);
    setShowForm(false);
    toast({
      title: "Expense Added",
      description: `${expense.title} - $${expense.amount.toFixed(2)} added successfully.`,
    });
  };

  const handleUpdateExpense = (submittedExpense: Omit<Expense, '_id' | 'createdAt'>) => {
    if (!editingExpense || !editingExpense._id) {
      console.error("Error: No expense selected for editing or missing _id.");
      toast({
        title: "Update Failed",
        description: "Could not find the expense to update.",
        variant: "destructive",
      });
      return;
    }
    
    updateExpense(editingExpense._id, submittedExpense);
    setShowEditModal(false); // Close modal after update
    setEditingExpense(undefined); // Clear editing expense
    toast({
      title: "Expense Updated",
      description: "Expense has been updated successfully.",
    });
  };

  const handleDeleteExpense = (id: string) => {
    const expense = allExpenses.find(e => e._id === id);
    deleteExpense(id);
    toast({
      title: "Expense Deleted",
      description: expense ? `${expense.title} has been deleted.` : "Expense deleted successfully.",
      variant: "destructive",
    });
  };

  const handleExport = () => {
    exportToCSV();
    toast({
      title: "Export Complete",
      description: "Your expenses have been exported to CSV.",
    });
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowEditModal(true);
  };

  // Use the same calculation method as in getSummary
  const summary = getSummary();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Modern Header with Gradient */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                  <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold gradient-text">
                  Expense Tracker
                </h1>
              </div>
              <p className="text-muted-foreground text-base sm:text-lg">
                Track and manage your daily expenses with ease
              </p>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-5 w-5" />
              Add Expense
            </Button>
          </div>

          {/* Enhanced Summary Cards */}
          <div className="glass-card rounded-2xl p-6 border border-border/50">
            <ExpenseSummary summary={summary} />
          </div>
        </div>

        {/* Add Expense Form with Modern Styling */}
        {showForm && (
          <div className="mb-8">
            <div className="glass-card rounded-2xl p-6 border-2 border-primary/20">
              <ExpenseForm 
                onSubmit={handleAddExpense}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* Enhanced Filters */}
        <div className="mb-8">
          <div className="glass-card rounded-xl border border-border/50">
            <ExpenseFilters
              filters={filters}
              onFiltersChange={setFilters}
              onExport={handleExport}
            />
          </div>
        </div>

        {/* Modern Tabs with Enhanced Styling */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30 backdrop-blur-sm rounded-xl p-1 border border-border/50">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all duration-200 data-[state=active]:border data-[state=active]:border-border/50"
            >
              <Home className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="expenses" 
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all duration-200 data-[state=active]:border data-[state=active]:border-border/50"
            >
              <List className="h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all duration-200 data-[state=active]:border data-[state=active]:border-border/50"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-border/50">
              <ExpenseChart expenses={allExpenses} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6 border border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <List className="h-5 w-5 text-primary" />
                  Recent Expenses
                </h3>
                <div className="scrollbar-thin max-h-96 overflow-y-auto">
                  <ExpenseList
                    expenses={expenses.slice(0, 5)}
                    onUpdate={handleUpdateExpense}
                    onDelete={handleDeleteExpense}
                    onEdit={handleEdit}
                  />
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6 border border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {allExpenses.length}
                    </div>
                    <div className="text-muted-foreground text-sm">Total Expenses</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      {allExpenses.length === 0
                        ? "₹0.00"
                        : `₹${summary.total.toFixed(2)}`}
                    </div>
                    <div className="text-muted-foreground text-sm">Total Net Amount</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <List className="h-5 w-5 text-primary" />
                All Expenses
              </h3>
              <div className="scrollbar-thin max-h-96 overflow-y-auto">
                <ExpenseList
                  expenses={expenses}
                  onUpdate={handleUpdateExpense}
                  onDelete={handleDeleteExpense}
                  onEdit={handleEdit}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-border/50">
              <ExpenseChart expenses={allExpenses} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Expense Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
            </DialogHeader>
            {editingExpense && (
              <ExpenseForm
                initialData={editingExpense}
                onSubmit={handleUpdateExpense}
                onCancel={() => {
                  setShowEditModal(false);
                  setEditingExpense(undefined);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
