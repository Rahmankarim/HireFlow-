'use client';

import React, { useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { KanbanCard } from './kanban-card';

export interface PipelineStage {
  id: string;
  name: string;
  order_index: number;
}

export interface Application {
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

interface KanbanBoardProps {
  applications: Application[];
  stages: PipelineStage[];
  onDragEnd: (applicationId: string, newStageId: string) => void;
}

export function KanbanBoard({ applications, stages, onDragEnd }: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const groupedApplications = useMemo(() => {
    const grouped: Record<string, Application[]> = {};
    stages.forEach((stage) => {
      grouped[stage.id] = applications.filter(
        (app) => app.pipeline_stage_id === stage.id
      );
    });
    return grouped;
  }, [applications, stages]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const [applicationId, currentStageId] = active.id.toString().split('-');
    const [, targetStageId] = over.id.toString().split('-');

    if (currentStageId !== targetStageId) {
      onDragEnd(applicationId, targetStageId);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-80">
            <KanbanColumn stage={stage}>
              <SortableContext
                items={groupedApplications[stage.id].map(
                  (app) => `${app.id}-${stage.id}`
                )}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {groupedApplications[stage.id].map((application) => (
                    <KanbanCard
                      key={application.id}
                      application={application}
                      stageId={stage.id}
                    />
                  ))}
                </div>
              </SortableContext>
            </KanbanColumn>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
