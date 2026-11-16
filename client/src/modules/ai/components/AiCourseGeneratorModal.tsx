'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sparkles,
  Loader2,
  BookOpen,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  aiClientService,
  GeneratedCourseOutline,
} from '../services/ai.service';
import { Category } from '@/types/course.types';

interface AiCourseGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export function AiCourseGeneratorModal({
  isOpen,
  onClose,
  categories,
}: AiCourseGeneratorModalProps) {
  const router = useRouter();

  // Step state: 'prompt' | 'generating' | 'preview'
  const [step, setStep] = useState<'prompt' | 'generating' | 'preview'>('prompt');

  // Input Form
  const [topic, setTopic] = useState('');
  const [targetLevel, setTargetLevel] = useState('Beginner');
  const [moduleCount, setModuleCount] = useState(4);
  const [language, setLanguage] = useState('en');
  const [categoryId, setCategoryId] = useState('');

  // Generated Result
  const [outline, setOutline] = useState<GeneratedCourseOutline | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({
    0: true,
  });

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error('Please enter a course topic');
      return;
    }

    setStep('generating');
    try {
      const res = await aiClientService.generateCourseOutline({
        topic,
        targetLevel,
        moduleCount,
        language,
        categoryId: categoryId || undefined,
      });

      if (res && res.data) {
        setOutline(res.data);
        setStep('preview');
        toast.success('Course outline generated successfully!');
      } else {
        throw new Error('Failed to generate course outline');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'AI generation failed');
      setStep('prompt');
    }
  };

  const toggleModule = (idx: number) => {
    setExpandedModules((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleDeleteModule = (idx: number) => {
    if (!outline) return;
    const updated = outline.modules.filter((_, i) => i !== idx);
    setOutline({ ...outline, modules: updated });
  };

  const handleDeleteLesson = (mIdx: number, lIdx: number) => {
    if (!outline) return;
    const updated = [...outline.modules];
    updated[mIdx].lessons = updated[mIdx].lessons.filter((_, i) => i !== lIdx);
    setOutline({ ...outline, modules: updated });
  };

  const handleSaveAndCreate = async () => {
    if (!outline || !outline.title) return;
    setIsSaving(true);
    try {
      const res = await aiClientService.saveAiCourse({
        title: outline.title,
        description: outline.description,
        categoryId: categoryId || null,
        price: 0,
        modules: outline.modules,
      });

      toast.success('Course and curriculum created successfully!');
      onClose();
      if (res.data?.id) {
        router.push(`/instructor/courses/${res.data.id}`);
      } else {
        router.push('/instructor/courses');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save generated course');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-surface-card border border-border-subtle p-6 rounded-2xl shadow-xl">
        <DialogHeader className="border-b border-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-on-surface">
                AI Course Generator
              </DialogTitle>
              <p className="text-xs text-on-surface-variant">
                Craft complete, syllabus-ready courses and module structures with AI
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* STEP 1: PROMPT FORM */}
        {step === 'prompt' && (
          <form onSubmit={handleGenerate} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                What do you want to teach? <span className="text-secondary">*</span>
              </Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Modern Full-Stack Development with Next.js 15, PostgreSQL & Tailwind"
                required
                className="p-4 bg-surface-bg border-border-subtle rounded-xl text-on-surface focus:ring-2 focus:ring-secondary/20"
              />
              <p className="text-xs text-on-surface-variant">
                Be as specific or broad as you like. Mention core technologies or goals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Target Level
                </Label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  className="w-full p-3 bg-surface-bg border border-border-subtle rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Number of Modules
                </Label>
                <select
                  value={moduleCount}
                  onChange={(e) => setModuleCount(Number(e.target.value))}
                  className="w-full p-3 bg-surface-bg border border-border-subtle rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  <option value={2}>2 Modules (Crash Course)</option>
                  <option value={3}>3 Modules (Focused)</option>
                  <option value={4}>4 Modules (Standard)</option>
                  <option value={5}>5 Modules (Deep Dive)</option>
                  <option value={6}>6 Modules (Masterclass)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Language
                </Label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 bg-surface-bg border border-border-subtle rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  <option value="en">English</option>
                  <option value="fr">French (Français)</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="es">Spanish (Español)</option>
                </select>
              </div>
            </div>

            {categories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Category (Optional)
                </Label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-3 bg-surface-bg border border-border-subtle rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  <option value="">Select a category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-secondary text-white hover:bg-secondary/90 flex items-center gap-2 px-6"
              >
                <Sparkles className="w-4 h-4" />
                Generate Course Outline
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: GENERATING STATE */}
        {step === 'generating' && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin"></div>
              <Sparkles className="w-6 h-6 text-secondary absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-on-surface">
                Designing Your Curriculum...
              </h3>
              <p className="text-xs text-on-surface-variant max-w-sm">
                Structuring modules, sequencing lesson objectives, and calibrating durations for optimal learner retention.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: PREVIEW & CUSTOMIZE */}
        {step === 'preview' && outline && (
          <div className="space-y-6 pt-4">
            {/* Course Overview Card */}
            <div className="p-5 bg-surface-bg rounded-xl border border-border-subtle space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-on-surface-variant">
                  Course Title
                </Label>
                <Input
                  value={outline.title}
                  onChange={(e) => setOutline({ ...outline, title: e.target.value })}
                  className="font-bold text-lg bg-surface-card border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-on-surface-variant">
                  Course Description
                </Label>
                <Textarea
                  value={outline.description}
                  onChange={(e) =>
                    setOutline({ ...outline, description: e.target.value })
                  }
                  rows={3}
                  className="bg-surface-card border-border-subtle text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-4 text-xs font-medium text-on-surface-variant pt-2 border-t border-border-subtle">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-secondary" />
                  <span>{outline.modules.length} Modules</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span>~{outline.estimatedTotalHours} Total Hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-secondary" />
                  <span>Level: {outline.targetLevel}</span>
                </div>
              </div>
            </div>

            {/* Modules Hierarchy Preview */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold uppercase text-on-surface-variant tracking-wider">
                  Generated Curriculum ({outline.modules.length} Modules)
                </h4>
                <span className="text-xs text-on-surface-variant">
                  Click to expand & review lessons
                </span>
              </div>

              {outline.modules.map((mod, mIdx) => {
                const isExpanded = expandedModules[mIdx];
                return (
                  <div
                    key={mIdx}
                    className="border border-border-subtle rounded-xl bg-surface-bg overflow-hidden transition-all"
                  >
                    <div
                      onClick={() => toggleModule(mIdx)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center">
                          {mIdx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-sm text-on-surface">
                            {mod.title}
                          </p>
                          <p className="text-xs text-on-surface-variant line-clamp-1">
                            {mod.description} • {mod.lessons.length} lessons
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteModule(mIdx);
                          }}
                          className="p-1.5 text-on-surface-variant hover:text-error rounded-lg hover:bg-error/10 transition-colors"
                          title="Delete Module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-on-surface-variant" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-border-subtle space-y-2 bg-surface-card">
                        {mod.lessons.map((lesson, lIdx) => (
                          <div
                            key={lIdx}
                            className="p-3 bg-surface-bg rounded-lg border border-border-subtle flex items-center justify-between gap-3 text-sm"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <span className="p-1.5 rounded-md bg-surface-container text-secondary shrink-0">
                                {lesson.type === 'video' ? (
                                  <Video className="w-3.5 h-3.5" />
                                ) : lesson.type === 'pdf' ? (
                                  <FileText className="w-3.5 h-3.5" />
                                ) : (
                                  <HelpCircle className="w-3.5 h-3.5" />
                                )}
                              </span>
                              <div className="overflow-hidden">
                                <p className="font-medium text-xs text-on-surface truncate">
                                  {lesson.title}
                                </p>
                                <p className="text-[11px] text-on-surface-variant">
                                  {lesson.duration} min • {lesson.type}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteLesson(mIdx, lIdx)}
                              className="text-on-surface-variant hover:text-error p-1 transition-colors"
                              title="Remove Lesson"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-border-subtle">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('prompt')}
                disabled={isSaving}
              >
                Back / Regenerate
              </Button>

              <Button
                onClick={handleSaveAndCreate}
                disabled={isSaving || outline.modules.length === 0}
                className="bg-secondary text-white hover:bg-secondary/90 px-8 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Course & Modules...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Create Course & Save Curriculum
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
