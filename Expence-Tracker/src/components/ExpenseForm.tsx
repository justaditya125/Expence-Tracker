import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, DollarSign, Tag, FileText, ArrowUp, ArrowDown } from 'lucide-react';
import { Expense, Category, ExpenseType } from '@/types/expense';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, '_id' | 'createdAt'>) => void;
  initialData?: Expense;
  onCancel?: () => void;
}

const categories: Category[] = [
  'Food', 'Transport', 'Utilities', 'Entertainment', 
  'Healthcare', 'Shopping', 'Education', 'Other'
];

const types: ExpenseType[] = ['Debit', 'Credit'];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  initialData,
  onCancel
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'Food');
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  );
  const [type, setType] = useState<ExpenseType>(initialData?.type || 'Debit');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) return;

    onSubmit({
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date,
      type,
    });

    // Reset form if not editing
    if (!initialData) {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setType('Debit');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
          {initialData ? 'Edit Expense' : 'Add New Expense'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2 text-sm sm:text-base">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter expense title"
              required
              className="text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2 text-sm sm:text-base">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
              Amount (INR)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              prefix="₹"
              className="text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm sm:text-base">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
              Category
            </Label>
            <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-sm sm:text-base">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2 text-sm sm:text-base">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm sm:text-base">
              <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
              <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
              Type
            </Label>
            <Select value={type} onValueChange={(value: ExpenseType) => setType(value)}>
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {types.map(t => (
                  <SelectItem key={t} value={t} className="text-sm sm:text-base">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button type="submit" className="w-full sm:flex-1 text-sm sm:text-base">
              {initialData ? 'Update' : 'Add'} Expense
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto text-sm sm:text-base">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
