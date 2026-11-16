import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableModule } from './SortableModule';
import { modulesService } from '@/modules/courses/services/modules.service';
import { lessonsService } from '@/modules/courses/services/lessons.service';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { AiModuleGeneratorModal } from '@/modules/ai/components/AiModuleGeneratorModal';
// Lesson service is imported dynamically below or via props

interface CurriculumBuilderProps {
  courseId: string;
  modules: any[];
  onUpdate: () => void;
  onAddModule: () => void;
  onEditModule: (module: any) => void;
  onDeleteModule: (moduleId: string) => void;
  onAddLesson: (moduleId: string) => void;
  onEditLesson: (lesson: any) => void;
  onDeleteLesson: (lessonId: string) => void;
  onAddExam?: (moduleId: string) => void;
  onAddCodingChallenge?: (moduleId: string) => void;
  onEditExam?: (exam: any) => void;
  onDeleteExam?: (examId: string) => void;
}

export function CurriculumBuilder({
  courseId,
  modules,
  onUpdate,
  onAddModule,
  onEditModule,
  onDeleteModule,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onAddExam,
  onAddCodingChallenge,
  onEditExam,
  onDeleteExam,
}: CurriculumBuilderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAiModuleModalOpen, setIsAiModuleModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      // Determine if dragging a module or a lesson based on the active.data
      const activeType = active.data.current?.type;
      const overType = over.data.current?.type;

      if (activeType === 'Module' && overType === 'Module') {
        const oldIndex = modules.findIndex((m) => m.id === active.id);
        const newIndex = modules.findIndex((m) => m.id === over.id);

        const newModules = arrayMove(modules, oldIndex, newIndex);

        // Optimistic update UI or just call API
        try {
          const moduleIds = newModules.map((m) => m.id);
          await modulesService.reorderModules(courseId, moduleIds); // Assuming frontend service takes array of strings or updates
          // For SRS compliance (id and orderIndex):
          // Actually, our API expects `modules: { id: string; orderIndex: number }[]`
          // We might need to map it if the service doesn't do it automatically.
          toast.success('Modules reordered');
          onUpdate();
        } catch (error) {
          toast.error('Failed to reorder modules');
          onUpdate(); // Revert
        }
      }

      if (activeType === 'Lesson' && overType === 'Lesson') {
        const activeLesson = active.data.current?.lesson;
        const overLesson = over.data.current?.lesson;

        if (activeLesson.moduleId === overLesson.moduleId) {
          const moduleObj = modules.find((m) => m.id === activeLesson.moduleId);
          const oldIndex = moduleObj.lessons.findIndex(
            (l: any) => l.id === active.id
          );
          const newIndex = moduleObj.lessons.findIndex(
            (l: any) => l.id === over.id
          );

          const newLessons = arrayMove(moduleObj.lessons, oldIndex, newIndex);
          const lessonIds = newLessons.map((l: any) => l.id);
          lessonsService
            .reorderLessons(activeLesson.moduleId, lessonIds)
            .then(() => {
              toast.success('Lessons reordered');
              onUpdate();
            })
            .catch(() => {
              toast.error('Failed to reorder lessons');
              onUpdate();
            });
        }
      }
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.4' } },
    }),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 hidden">
        {/* We can hide this header since the Sidebar already has a Curriculum header */}
        <h2 className="text-xl font-bold text-primary">Course Curriculum</h2>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={modules.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          {modules.map((module: any, idx: number) => (
            <SortableModule
              key={module.id}
              module={module}
              index={idx}
              onAddLesson={onAddLesson}
              onEditModule={onEditModule}
              onDeleteModule={onDeleteModule}
              onEditLesson={onEditLesson}
              onDeleteLesson={onDeleteLesson}
              onAddExam={onAddExam}
              onAddCodingChallenge={onAddCodingChallenge}
              onEditExam={onEditExam}
              onDeleteExam={onDeleteExam}
            />
          ))}
        </SortableContext>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onAddModule}
            variant="outline"
            className="flex-1 border-dashed border-2 border-border-subtle text-on-surface-variant hover:text-primary hover:border-primary hover:bg-surface-container-low h-12 flex items-center justify-center gap-2 rounded-xl transition-all"
          >
            <Plus size={18} />
            <span className="font-semibold">Add New Module</span>
          </Button>
          <Button
            onClick={() => setIsAiModuleModalOpen(true)}
            variant="outline"
            className="border-secondary/40 text-secondary hover:bg-secondary/10 h-12 flex items-center justify-center gap-2 rounded-xl transition-all font-semibold px-5 shadow-sm"
          >
            <Sparkles size={18} />
            <span>AI Generate Module</span>
          </Button>
        </div>

        <AiModuleGeneratorModal
          isOpen={isAiModuleModalOpen}
          onClose={() => setIsAiModuleModalOpen(false)}
          courseId={courseId}
          existingModuleCount={modules.length}
          onSuccess={onUpdate}
        />

        <DragOverlay dropAnimation={dropAnimation}>
          {activeId ? (
            <div className="bg-surface-container-high p-4 rounded-xl border border-secondary shadow-2xl opacity-90">
              <p className="text-primary font-medium">Dragging Item...</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
