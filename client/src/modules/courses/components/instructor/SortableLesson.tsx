import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Video,
  FileText,
  File,
  Trash2,
  Edit,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableLessonProps {
  lesson: any;
  onEdit: (lesson: any) => void;
  onDelete: (lessonId: string) => void;
}

export function SortableLesson({
  lesson,
  onEdit,
  onDelete,
}: SortableLessonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id, data: { type: 'Lesson', lesson } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const getIcon = () => {
    switch (lesson.type) {
      case 'video':
        return <Video size={14} className="text-secondary" />;
      case 'pdf':
        return <FileText size={14} className="text-error" />;
      case 'text':
        return <FileText size={14} className="text-success" />;
      case 'quiz':
        return <HelpCircle size={14} className="text-warning" />;
      default:
        return <File size={14} className="text-on-surface-variant" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 mb-2.5 rounded-xl bg-surface-container-lowest border border-border-subtle group hover:border-primary/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab active:cursor-grabbing text-on-surface-variant hover:text-primary p-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
        >
          <GripVertical size={16} />
        </button>
        <div
          onClick={() => onEdit(lesson)}
          className="flex items-center gap-3 text-on-surface-variant text-sm cursor-pointer flex-1 py-1"
        >
          <div className="p-1.5 bg-surface-container-low rounded-lg text-on-surface-variant group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            {getIcon()}
          </div>
          <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">
            {lesson.title}
          </span>
        </div>
      </div>

      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(lesson)}
          className="h-8 w-8 p-0 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg"
        >
          <Edit size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(lesson.id)}
          className="h-8 w-8 p-0 text-error hover:text-error hover:bg-error/10 rounded-lg"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
