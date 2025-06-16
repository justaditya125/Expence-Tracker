import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Expense, Category } from '@/types/expense';

interface ExpenseChartProps {
  expenses: Expense[];
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  // Prepare data for category breakdown
  const categoryTotals = expenses.reduce((acc, expense) => {
    // Track both credit and debit
    acc[expense.category] = acc[expense.category] || { credit: 0, debit: 0 };
    if (expense.type === "Credit") {
      acc[expense.category].credit += expense.amount;
    } else {
      acc[expense.category].debit += Math.abs(expense.amount); // always positive for chart
    }
    return acc;
  }, {} as Record<Category, { credit: number; debit: number }>);

  // Now make pieData for both Credit and Debit (show both as separate slices)
  // Show only filled categories for visual clarity
  const pieData: { name: string; value: number; type: 'Credit' | 'Debit' }[] = [];
  Object.entries(categoryTotals).forEach(([category, totals]) => {
    if (totals.credit)
      pieData.push({ name: `${category} (Credit)`, value: totals.credit, type: 'Credit' });
    if (totals.debit)
      pieData.push({ name: `${category} (Debit)`, value: totals.debit, type: 'Debit' });
  });

  // Prepare data for daily spending (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyData = last7Days.map(date => {
    const dayExpenses = expenses.filter(expense => 
      new Date(expense.date).toISOString().split('T')[0] === date
    );
    const total = dayExpenses.reduce((sum, expense) =>
      sum + (expense.type === 'Credit' ? expense.amount : -expense.amount), 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      amount: total
    };
  });

  const colors = [
    "#8884d8", "#82ca9d", "#ff7300", "#ffb347",
    "#8dd1e1", "#d084d0", "#ffc658", "#87ceeb",
    // Add more if needed
    "#ff0000", "#00ff00", "#0000ff", "#ffff00"
  ];

  const chartConfig = {
    amount: {
      label: "Amount (INR)",
    },
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Spending Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No data to display. Add some expenses to see charts.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Help BarChart: find global min/max to allow negative bars to fit with padding
  const valuesAllDays = dailyData.map(d => d.amount);
  const dataMin = Math.min(0, ...valuesAllDays);
  const dataMax = Math.max(0, ...valuesAllDays);
  const padding = Math.abs(dataMax - dataMin) * 0.1 || 100; // 10% padding or minimum 100
  const barMin = dataMin - padding;
  const barMax = dataMax + padding;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Spending Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Net Daily Balance (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={dailyData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[barMin, barMax]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Amount (INR)']}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Net Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === "Credit" ? colors[index % colors.length] : "#e57373"} 
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name, item, idx) => [
                    `₹${Number(value).toFixed(2)}`, 
                    pieData[idx]?.type || ''
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.type === "Credit" ? colors[index % colors.length] : "#e57373" }}
                />
                <span>
                  {entry.name}: ₹{entry.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
