'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  icon: React.ElementType;
  title: string;
  value: number | string;
  subtext?: string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
    period?: string;
  };
  backgroundColor?: string;
}

export function StatsCard({
  icon: Icon,
  title,
  value,
  subtext,
  trend,
  backgroundColor = 'bg-blue-50',
}: StatsCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`p-3 rounded-lg ${backgroundColor} w-fit`}
          >
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold ${
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.direction === 'up' ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              {trend.percentage}%
            </div>
          )}
        </div>

        <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-xs text-gray-500">
              {trend.period ? `vs ${trend.period}` : ''}
            </p>
          )}
        </div>

        {subtext && (
          <p className="text-xs text-gray-500 mt-2">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}
