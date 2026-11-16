import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  GripVertical,
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortableLesson } from './SortableLesson';

interface SortableModuleProps {
  module: any;
  index: number;
  onAddLesson: (moduleId: string) => void;
  onEditModule: (module: any) => void;
  onDeleteModule: (moduleId: string) => void;
  onEditLesson: (lesson: any) => void;
  onDeleteLesson: (lessonId: string) => void;
  onAddExam?: (moduleId: string) => void;
  onAddCodingChallenge?: (moduleId: string) => void;
  onEditExam?: (exam: any) => void;
  onDeleteExam?: (examId: string) => void;
}

export function SortableModule({
  module,
  index,
  onAddLesson,
  onEditModule,
  onDeleteModule,
  onEditLesson,
  onDeleteLesson,
  onAddExam,
  onAddCodingChallenge,
  onEditExam,
  onDeleteExam,
}: SortableModuleProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id, data: { type: 'Module', module } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-border-subtle bg-surface-container-lowest rounded-2xl overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="bg-surface-bright p-3 border-b border-border-subtle flex flex-col gap-2 group">
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-on-surface-variant hover:text-primary p-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            <GripVertical size={18} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-on-surface-variant hover:text-primary p-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
          <h3 className="font-semibold text-primary ml-1 text-sm tracking-tight flex-1 pt-1 leading-snug">
            Module {index + 1}: {module.title}
          </h3>
        </div>

        <div className="flex items-center flex-wrap gap-1.5 pl-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditModule(module)}
            className="h-8 w-8 p-0 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteModule(module.id)}
            className="h-8 w-8 p-0 text-error hover:text-error hover:bg-error/10 rounded-lg"
          >
            <Trash2 size={16} />
          </Button>
          <div className="w-px h-6 bg-border-subtle mx-1"></div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddLesson(module.id)}
            className="bg-surface-bg text-on-surface hover:text-primary hover:bg-surface-container border border-border-subtle ml-1 h-8 text-xs font-semibold rounded-lg shadow-sm"
          >
            <Plus size={14} className="mr-1" /> Lesson
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddExam?.(module.id)}
            className="bg-surface-bg text-on-surface hover:text-primary hover:bg-surface-container border border-border-subtle ml-1 h-8 text-xs font-semibold rounded-lg shadow-sm"
          >
            <Plus size={14} className="mr-1" /> Exam
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddCodingChallenge?.(module.id)}
            className="bg-surface-bg text-secondary hover:text-secondary-fixed hover:bg-surface-container border border-border-subtle ml-1 h-8 text-xs font-semibold rounded-lg shadow-sm"
          >
            <Plus size={14} className="mr-1" /> Challenge
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-surface-bg/30">
          {module.lessons?.length > 0 ? (
            <SortableContext
              items={module.lessons.map((l: any) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {module.lessons.map((lesson: any) => (
                <SortableLesson
                  key={lesson.id}
                  lesson={lesson}
                  onEdit={onEditLesson}
                  onDelete={onDeleteLesson}
                />
              ))}
            </SortableContext>
          ) : (
            <div className="text-center py-6 border border-dashed border-border-subtle rounded-lg">
              <p className="text-sm text-on-surface-variant mb-2">
                No lessons in this module yet.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddLesson(module.id)}
                className="border-border-subtle text-on-surface-variant hover:text-primary h-8"
              >
                <Plus size={14} className="mr-1" /> Add First Lesson
              </Button>
            </div>
          )}

          {/* Render Exams at the bottom */}
          {module.exams?.length > 0 && (
            <div className="mt-4 border-t border-border-subtle pt-4">
              <h4 className="text-xs font-semibold text-on-surface-variant mb-3 uppercase tracking-wider">
                Module Exams & Challenges
              </h4>
              <div className="space-y-2">
                {module.exams.map((exam: any) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between p-3 bg-secondary/5 border border-secondary/20 rounded-lg group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-secondary/15 text-secondary rounded-md">
                        {exam.type === 'coding' ? (
                          <span className="material-symbols-outlined text-[18px]">
                            terminal
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-[18px]">
                            help
                          </span>
                        )}
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-primary">
                          {exam.title}
                        </h5>
                        <p className="text-xs text-on-surface-variant">
                          {exam.durationMinutes} mins •{' '}
                          {exam.type === 'coding'
                            ? 'Coding Challenge'
                            : 'QCM Exam'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditExam?.(exam)}
                        className="h-7 w-7 p-0 text-on-surface-variant hover:text-primary"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteExam?.(exam.id)}
                        className="h-7 w-7 p-0 text-error hover:text-error/80"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
