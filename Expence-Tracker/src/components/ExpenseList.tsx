import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Calendar, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { Expense } from '@/types/expense';
import type { VariantProps } from 'class-variance-authority';

interface ExpenseListProps {
  expenses: Expense[];
  onUpdate: (id: string, updates: Partial<Expense>) => void;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onUpdate,
  onDelete,
  onEdit
}) => {
  const handleEdit = (expense: Expense) => {
    onEdit(expense);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      Transport: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Utilities: 'bg-green-500/20 text-green-400 border-green-500/30',
      Entertainment: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      Healthcare: 'bg-red-500/20 text-red-400 border-red-500/30',
      Shopping: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      Education: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      Other: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[category] || colors.Other;
  };

  const getTypeBadge = (type: string) =>
    type === 'Credit'
      ? <Badge className="bg-green-500/20 text-green-500 border-green-500/30 flex items-center gap-1"><ArrowUp className="h-4 w-4" /> Credit</Badge>
      : <Badge className="bg-red-500/20 text-red-500 border-red-500/30 flex items-center gap-1"><ArrowDown className="h-4 w-4" /> Debit</Badge>;

  if (expenses.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No expenses found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add your first expense to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <Card key={expense._id} className="overflow-hidden">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="font-semibold text-base sm:text-lg">{expense.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`${getCategoryColor(expense.category)} text-xs sm:text-sm`}>
                    {expense.category}
                  </Badge>
                  {getTypeBadge(expense.type)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    {formatDate(expense.date)}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                <div className="text-right">
                  <div className={`text-xl sm:text-2xl font-bold ${expense.type === 'Credit' ? 'text-green-500' : 'text-primary'}`}>
                    {expense.type === 'Credit' ? '+' : '-'}₹{expense.amount.toFixed(2)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={'outline' as ButtonVariant}
                    size={'icon' as ButtonSize}
                    onClick={() => handleEdit(expense)}
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={'destructive' as ButtonVariant}
                    size={'icon' as ButtonSize}
                    onClick={() => onDelete(expense._id)}
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
