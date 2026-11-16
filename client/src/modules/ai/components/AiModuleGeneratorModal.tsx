'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Video, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { aiClientService, GeneratedModule } from '../services/ai.service';
import { modulesService } from '@/modules/courses/services/modules.service';
import { lessonsService } from '@/modules/courses/services/lessons.service';

interface AiModuleGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle?: string;
  existingModuleCount: number;
  onSuccess: () => void;
}

export function AiModuleGeneratorModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  existingModuleCount,
  onSuccess,
}: AiModuleGeneratorModalProps) {
  const [topic, setTopic] = useState('');
  const [lessonCount, setLessonCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedModule, setGeneratedModule] =
    useState<GeneratedModule | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const res = await aiClientService.generateModule({
        topic,
        courseTitle,
        lessonCount,
      });

      if (res && res.data) {
        setGeneratedModule(res.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate module');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertModule = async () => {
    if (!generatedModule) return;
    setIsSaving(true);
    try {
      // 1. Create Module in Database
      const modRes = await modulesService.createModule({
        courseId,
        title: generatedModule.title,
        description: generatedModule.description || '',
        orderIndex: existingModuleCount,
        isLocked: existingModuleCount > 0,
      });

      const newModuleId = modRes.data?.id;

      // 2. Create Lessons in Module
      if (newModuleId && generatedModule.lessons?.length > 0) {
        for (let i = 0; i < generatedModule.lessons.length; i++) {
          const l = generatedModule.lessons[i];
          await lessonsService.createLesson({
            moduleId: newModuleId,
            title: l.title,
            type: l.type || 'video',
            duration: l.duration || 5,
            content: l.content || '',
            orderIndex: i,
          });
        }
      }

      toast.success('Module and lessons added to course!');
      onSuccess();
      onClose();
      setGeneratedModule(null);
      setTopic('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to insert module');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-surface-card border border-border-subtle p-6 rounded-2xl shadow-xl">
        <DialogHeader className="border-b border-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-on-surface">
                AI Module Generator
              </DialogTitle>
              <p className="text-xs text-on-surface-variant">
                Generate a structured module with lessons directly into this
                course
              </p>
            </div>
          </div>
        </DialogHeader>

        {!generatedModule ? (
          <form onSubmit={handleGenerate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-on-surface-variant">
                Module Topic / Objective{' '}
                <span className="text-secondary">*</span>
              </Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Asynchronous JavaScript, Promises & Event Loop"
                required
                className="bg-surface-bg border-border-subtle p-3 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-on-surface-variant">
                Target Number of Lessons
              </Label>
              <select
                value={lessonCount}
                onChange={(e) => setLessonCount(Number(e.target.value))}
                className="w-full p-3 bg-surface-bg border border-border-subtle rounded-xl text-sm"
              >
                <option value={2}>2 Lessons</option>
                <option value={3}>3 Lessons</option>
                <option value={4}>4 Lessons</option>
                <option value={5}>5 Lessons</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-secondary text-white hover:bg-secondary/90 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Module
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-surface-bg rounded-xl border border-border-subtle space-y-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase text-on-surface-variant">
                  Module Title
                </Label>
                <Input
                  value={generatedModule.title}
                  onChange={(e) =>
                    setGeneratedModule({
                      ...generatedModule,
                      title: e.target.value,
                    })
                  }
                  className="font-bold bg-surface-card border-border-subtle"
                />
              </div>
              <p className="text-xs text-on-surface-variant">
                {generatedModule.description}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-on-surface-variant tracking-wider">
                Lessons to be created ({generatedModule.lessons.length})
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {generatedModule.lessons.map((lesson, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-surface-bg rounded-lg border border-border-subtle flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-surface-card text-secondary">
                        {lesson.type === 'video' ? (
                          <Video className="w-3.5 h-3.5" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <span className="font-medium text-on-surface">
                        {lesson.title}
                      </span>
                    </div>
                    <span className="text-on-surface-variant">
                      {lesson.duration} min
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border-subtle">
              <Button
                type="button"
                variant="outline"
                onClick={() => setGeneratedModule(null)}
                disabled={isSaving}
              >
                Back
              </Button>
              <Button
                onClick={handleInsertModule}
                disabled={isSaving}
                className="bg-secondary text-white hover:bg-secondary/90 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding Module...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Insert Module to Course
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
