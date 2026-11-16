'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { coursesService } from '@/modules/courses/services/courses.service';
import { Category } from '@/types/course.types';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/store/hooks';
import { Sparkles } from 'lucide-react';
import { AiCourseGeneratorModal } from '@/modules/ai/components/AiCourseGeneratorModal';

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const { currentTenant } = useAppSelector((state) => state.tenant);

  useEffect(() => {
    coursesService
      .getCategories()
      .then((res) => {
        if (res && res.data) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await coursesService.createCourse({
        title,
        description,
        categoryId: categoryId || undefined,
        price: currentTenant?.hasPaidCourses && price ? parseFloat(price) : 0,
      });
      toast.success('Course created successfully!');
      router.push(`/instructor/courses/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[32px] font-bold text-primary font-headline-lg tracking-tight">
            Create New Course
          </h2>
          <p className="text-on-surface-variant text-body-md mt-1">
            Provide the foundational details to publish a new learning journey
            on Lumina.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          className="bg-secondary text-white hover:bg-secondary/90 flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all self-start sm:self-auto font-bold"
        >
          <Sparkles className="w-4 h-4" />✨ Generate Course with AI
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Column */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-surface-card border border-border-subtle rounded-2xl p-8 shadow-sm space-y-6"
        >
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider"
            >
              Course Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Clean Code & Architecture"
              required
              className="w-full border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-4 rounded-xl outline-none"
            />
            <p className="text-xs text-on-surface-variant">
              A catchy title should be short, punchy, and describe the core
              skill.
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider"
            >
              Course Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of what students will achieve in this course..."
              rows={5}
              className="w-full border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-4 rounded-xl outline-none min-h-25 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider"
            >
              Course Category
            </Label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-3.5 rounded-xl outline-none text-sm cursor-pointer"
            >
              <option value="">Select a category (Optional)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-on-surface-variant">
              Classifying your course helps students discover it in the catalog.
            </p>
          </div>

          {currentTenant?.hasPaidCourses && (
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider"
              >
                Price (MAD)
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 1500"
                  required
                  className="w-full border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-4 pl-12 rounded-xl outline-none"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-bold text-sm">
                  MAD
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Set the standard enrollment fee for student access.
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-end pt-6 border-t border-border-subtle">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/instructor/courses')}
              className="px-6 py-2.5 border-border-subtle text-on-surface-variant hover:text-primary rounded-xl font-bold transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-secondary hover:bg-secondary/95 text-white font-bold px-8 py-2.5 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-secondary/10"
            >
              {isLoading ? 'Saving...' : 'Save Course'}
            </Button>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 sticky top-8 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">
              Live Card Preview
            </p>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--color-primary),0.5)]"></span>
          </div>

          <div className="w-full bg-surface-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Header Gradient Thumbnail */}
            <div className="bg-linear-to-tr from-secondary/80 to-primary/80 h-48 flex flex-col items-center justify-center p-6 text-white text-center relative group overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" />
              <span className="material-symbols-outlined text-[48px] opacity-80 mb-2">
                school
              </span>
              <p className="text-sm font-bold uppercase tracking-wider opacity-95">
                New Course Draft
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <span className="text-[10px] font-bold text-secondary bg-secondary/5 px-2.5 py-1 rounded-md uppercase tracking-wider w-fit block">
                Draft
              </span>

              <h4 className="text-xl font-extrabold text-primary line-clamp-2 min-h-[56px] leading-tight">
                {title || 'Course Title Placeholder'}
              </h4>

              <p className="text-body-sm text-on-surface-variant line-clamp-3 min-h-[60px] leading-relaxed">
                {description ||
                  'Your course description preview will populate dynamically as you write...'}
              </p>

              <div className="h-px bg-border-subtle" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-semibold">
                  <span className="material-symbols-outlined text-[16px]">
                    widgets
                  </span>
                  0 Modules
                </div>
                <div className="text-[20px] font-extrabold text-primary">
                  {price
                    ? `${parseFloat(price).toLocaleString()} MAD`
                    : '0 MAD'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AiCourseGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        categories={categories}
      />
    </div>
  );
}
