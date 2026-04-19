'use client';

import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  Users,
  Trophy,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface ApplicationStatusBadgeProps {
  status: 'submitted' | 'reviewing' | 'interview' | 'offer' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
}

export function ApplicationStatusBadge({
  status,
  size = 'md',
}: ApplicationStatusBadgeProps) {
  const statusConfig: Record<
    string,
    {
      icon: React.ElementType;
      label: string;
      className: string;
      bgColor: string;
    }
  > = {
    submitted: {
      icon: Clock,
      label: 'Applied',
      className: 'bg-blue-50 text-blue-900 border-blue-200',
      bgColor: 'bg-blue-100',
    },
    reviewing: {
      icon: Users,
      label: 'Under Review',
      className: 'bg-yellow-50 text-yellow-900 border-yellow-200',
      bgColor: 'bg-yellow-100',
    },
    interview: {
      icon: AlertCircle,
      label: 'Interview',
      className: 'bg-purple-50 text-purple-900 border-purple-200',
      bgColor: 'bg-purple-100',
    },
    offer: {
      icon: Trophy,
      label: 'Offer',
      className: 'bg-green-50 text-green-900 border-green-200',
      bgColor: 'bg-green-100',
    },
    rejected: {
      icon: XCircle,
      label: 'Rejected',
      className: 'bg-red-50 text-red-900 border-red-200',
      bgColor: 'bg-red-100',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const iconSizeMap = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <Badge
      className={`flex items-center gap-1.5 ${config.className} ${textSizeMap[size]} border`}
    >
      <Icon className={iconSizeMap[size]} />
      {config.label}
    </Badge>
  );
}
