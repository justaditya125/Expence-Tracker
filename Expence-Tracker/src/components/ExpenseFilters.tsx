import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Download } from 'lucide-react';
import { Category, FilterOptions } from '@/types/expense';

interface ExpenseFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onExport: () => void;
}

const categories: (Category | 'All')[] = [
  'All', 'Food', 'Transport', 'Utilities', 'Entertainment', 
  'Healthcare', 'Shopping', 'Education', 'Other'
];

const dateRanges = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' }
];

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFiltersChange,
  onExport
}) => {
  const handleCategoryChange = (category: Category | 'All') => {
    onFiltersChange({ ...filters, category });
  };

  const handleDateRangeChange = (dateRange: 'all' | 'today' | 'week' | 'month') => {
    onFiltersChange({ ...filters, dateRange });
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
          Filters & Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select 
              value={filters.category} 
              onValueChange={handleCategoryChange}
            >
                <SelectTrigger className="text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-sm sm:text-base">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

            <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Select 
              value={filters.dateRange} 
              onValueChange={handleDateRangeChange}
            >
                <SelectTrigger className="text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map(range => (
                    <SelectItem key={range.value} value={range.value} className="text-sm sm:text-base">
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={onExport} 
              variant="outline" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
