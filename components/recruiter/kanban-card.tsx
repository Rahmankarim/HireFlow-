'use client';

import React from 'react';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Mail } from 'lucide-react';

interface Application {
  id: string;
  status: string;
  applicant_id: string;
  pipeline_stage_id: string;
  users: {
    full_name: string;
    email: string;
    avatar_url: string;
  };
}

interface KanbanCardProps {
  application: Application;
  stageId: string;
}

export function KanbanCard({ application, stageId }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: `${application.id}-${stageId}`,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="cursor-move hover:shadow-md transition-shadow bg-white">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            {application.users.full_name}
          </h4>
          
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
            <Mail className="w-3 h-3" />
            <span className="truncate">{application.users.email}</span>
          </div>

          {application.users.avatar_url && (
            <div className="flex items-center gap-2 mt-3">
              <Image
                src={application.users.avatar_url}
                alt={application.users.full_name}
                width={32}
                height={32}
                unoptimized
                className="w-8 h-8 rounded-full"
              />
              <span className="text-xs text-gray-500">Profile</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
