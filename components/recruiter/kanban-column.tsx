'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface PipelineStage {
  id: string;
  name: string;
  order_index: number;
}

interface KanbanColumnProps {
  stage: PipelineStage;
  children: React.ReactNode;
}

export function KanbanColumn({ stage, children }: KanbanColumnProps) {
  return (
    <Card className="h-full bg-gray-50">
      <CardHeader>
        <CardTitle className="text-base">{stage.name}</CardTitle>
      </CardHeader>
      <div className="px-4 pb-4">{children}</div>
    </Card>
  );
}
