import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { coursesService } from '@/modules/courses/services/courses.service';
import { uploadService } from '@/services/upload.service';
import { toast } from 'react-toastify';
import { Course } from '@/types/course.types';
import { Lock, BookOpen, Check } from 'lucide-react';

interface CourseSettingsProps {
  course: any;
  onUpdate: () => void;
}

export function CourseSettings({ course, onUpdate }: CourseSettingsProps) {
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [price, setPrice] = useState(course?.price || 0);
  const [thumbnail, setThumbnail] = useState(course?.thumbnail || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Prerequisites state
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedPrereqIds, setSelectedPrereqIds] = useState<string[]>([]);
  const [loadingPrereqs, setLoadingPrereqs] = useState(false);

  useEffect(() => {
    const loadPrerequisitesData = async () => {
      if (!course?.id) return;
      setLoadingPrereqs(true);
      try {
        const [allRes, currentRes] = await Promise.all([
          coursesService.getCourses({ limit: 100 }),
          coursesService.getPrerequisites(course.id),
        ]);
        // Filter out current course
        const otherCourses = (allRes.data || []).filter(
          (c: any) => c.id !== course.id
        );
        setAllCourses(otherCourses);
        const currentPrereqIds = (currentRes.data || []).map((p: any) => p.id);
        setSelectedPrereqIds(currentPrereqIds);
      } catch {
        // ignore
      } finally {
        setLoadingPrereqs(false);
      }
    };

    loadPrerequisitesData();
  }, [course?.id]);

  const togglePrerequisite = (courseId: string) => {
    setSelectedPrereqIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadService.uploadFile(file);
      setThumbnail(url);
      toast.success('Thumbnail uploaded successfully');
    } catch {
      toast.error('Failed to upload thumbnail');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.all([
        coursesService.updateCourse(course.id, {
          title,
          description,
          price: parseFloat(price.toString()),
          thumbnail,
        }),
        coursesService.setPrerequisites(course.id, selectedPrereqIds),
      ]);
      toast.success('Course settings & prerequisites saved');
      onUpdate();
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 bg-zinc-900/50 border border-white/10 rounded-xl p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="title" className="text-zinc-300">
          Course Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-zinc-900 border-white/10 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-zinc-300">
          Description
        </Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex min-h-[120px] w-full rounded-md border bg-zinc-900 border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Detailed course description..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-zinc-300">
            Price (USD)
          </Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-zinc-900 border-white/10 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thumbnail" className="text-zinc-300">
            Thumbnail Image (Upload or URL)
          </Label>
          <div className="flex gap-2">
            <Input
              id="thumbnail"
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="bg-zinc-900 border-white/10 text-white flex-1"
              placeholder="https://example.com/image.png"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="w-auto bg-zinc-900 border-white/10 text-zinc-400 file:bg-zinc-800 file:text-white file:border-0 file:mr-2 file:px-3 file:py-1 file:rounded"
            />
          </div>
          {isUploading && <p className="text-xs text-blue-400">Uploading...</p>}
        </div>
      </div>

      {thumbnail && (
        <div className="mt-4">
          <p className="text-sm text-zinc-400 mb-2">Thumbnail Preview:</p>
          <div className="w-full max-w-sm aspect-video rounded-lg border border-white/10 overflow-hidden bg-black relative">
            <Image
              src={thumbnail}
              alt="Thumbnail preview"
              fill
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* Course Prerequisites Section */}
      <div className="border-t border-white/10 pt-6 space-y-3">
        <div className="flex items-center gap-2 text-white">
          <Lock className="w-4 h-4 text-amber-400" />
          <Label className="text-base font-semibold text-zinc-200">
            Course Prerequisites
          </Label>
        </div>
        <p className="text-xs text-zinc-400">
          Select courses that students must successfully complete before they
          can enroll in this course.
        </p>

        {loadingPrereqs ? (
          <div className="py-4 text-xs text-zinc-500">
            Loading prerequisites...
          </div>
        ) : allCourses.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">
            No other courses available to set as prerequisites.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-3 bg-zinc-950/60 rounded-xl border border-white/5">
            {allCourses.map((c) => {
              const isChecked = selectedPrereqIds.includes(c.id);
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => togglePrerequisite(c.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs text-left border transition-all ${
                    isChecked
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                      : 'bg-zinc-900/60 border-white/5 text-zinc-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <BookOpen className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    <span className="truncate font-medium">{c.title}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      isChecked
                        ? 'bg-amber-500 border-amber-500 text-black'
                        : 'border-white/30'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-white/10">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
}
