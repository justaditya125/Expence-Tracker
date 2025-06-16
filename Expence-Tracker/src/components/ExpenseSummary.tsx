import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Calendar, TrendingUp, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { ExpenseSummary as Summary } from '@/types/expense';

interface ExpenseSummaryProps {
  summary: Summary;
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ summary }) => {
  const summaryCards = [
    {
      title: 'Today',
      amount: summary.daily,
      icon: CalendarDays,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30',
      iconColor: summary.daily >= 0 ? 'text-green-400' : 'text-red-400',
      type: summary.daily >= 0 ? 'Credit' : 'Debit'
    },
    {
      title: 'This Week',
      amount: summary.weekly,
      icon: Calendar,
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      iconColor: summary.weekly >= 0 ? 'text-green-400' : 'text-red-400',
      type: summary.weekly >= 0 ? 'Credit' : 'Debit'
    },
    {
      title: 'This Month',
      amount: summary.monthly,
      icon: TrendingUp,
      gradient: 'from-purple-500/20 to-violet-500/20',
      border: 'border-purple-500/30',
      iconColor: summary.monthly >= 0 ? 'text-green-400' : 'text-red-400',
      type: summary.monthly >= 0 ? 'Credit' : 'Debit'
    },
    {
      title: 'Total',
      amount: summary.total,
      icon: DollarSign,
      gradient: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-500/30',
      iconColor: summary.total >= 0 ? 'text-green-400' : 'text-red-400',
      type: summary.total >= 0 ? 'Credit' : 'Debit'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {summaryCards.map((card) => (
        <Card key={card.title} className={`bg-gradient-to-br ${card.gradient} border ${card.border} backdrop-blur-sm hover:scale-105 transition-all duration-300`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-1.5 sm:p-2 rounded-lg bg-background/50 ${card.iconColor}`}>
              <card.icon className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold flex items-center gap-1">
              {card.type === 'Credit' ? (
                <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              ) : (
                <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
              )}
              ₹{Math.abs(card.amount).toFixed(2)}
            </div>
            <span className={`text-xs sm:text-sm ${card.type === 'Credit' ? 'text-green-500' : 'text-red-500'}`}>
              {card.type}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
