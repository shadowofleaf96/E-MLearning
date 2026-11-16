import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { coursesService } from '@/modules/courses/services/courses.service';
import { uploadService } from '@/services/upload.service';
import { toast } from 'react-toastify';

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadService.uploadFile(file);
      setThumbnail(url);
      toast.success('Thumbnail uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload thumbnail');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await coursesService.updateCourse(course.id, {
        title,
        description,
        price: parseFloat(price.toString()),
        thumbnail,
      });
      toast.success('Course settings updated');
      onUpdate();
    } catch (error) {
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

      <div className="flex justify-end pt-4">
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
