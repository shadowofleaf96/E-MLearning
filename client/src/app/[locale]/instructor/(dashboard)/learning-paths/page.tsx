'use client';

import React, { useState, useEffect } from 'react';
import {
  learningPathsService,
  LearningPath,
} from '@/modules/learning-paths/services/learningPaths.service';
import { coursesService } from '@/modules/courses/services/courses.service';
import { Course } from '@/types/course.types';
import {
  Compass,
  Plus,
  Users,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  CheckCircle,
  X,
} from 'lucide-react';

export default function InstructorLearningPathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    price: 0,
    isPublished: false,
    selectedCourseIds: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchPaths = async () => {
    setLoading(true);
    try {
      const [pathRes, courseRes] = await Promise.all([
        learningPathsService.getInstructorPaths(),
        coursesService.getCourses({ limit: 100 }),
      ]);
      setPaths(pathRes.data || []);
      setMyCourses(courseRes.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaths();
  }, []);

  const openCreateModal = () => {
    setEditingPath(null);
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      price: 0,
      isPublished: true,
      selectedCourseIds: [],
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (path: LearningPath) => {
    setEditingPath(path);
    setFormData({
      title: path.title,
      description: path.description || '',
      thumbnail: path.thumbnail || '',
      price: Number(path.price) || 0,
      isPublished: path.isPublished,
      selectedCourseIds: path.courses?.map((c) => c.courseId) || [],
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleToggleCourse = (courseId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedCourseIds.includes(courseId);
      if (exists) {
        return {
          ...prev,
          selectedCourseIds: prev.selectedCourseIds.filter(
            (id) => id !== courseId
          ),
        };
      } else {
        return {
          ...prev,
          selectedCourseIds: [...prev.selectedCourseIds, courseId],
        };
      }
    });
  };

  const moveCourse = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const list = [...prev.selectedCourseIds];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, selectedCourseIds: list };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Title is required');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    try {
      if (editingPath) {
        await learningPathsService.updatePath(editingPath.id, {
          title: formData.title,
          description: formData.description,
          thumbnail: formData.thumbnail || undefined,
          price: Number(formData.price),
          isPublished: formData.isPublished,
          courseIds: formData.selectedCourseIds,
        });
        setSuccessMsg('Learning path updated successfully!');
      } else {
        await learningPathsService.createPath({
          title: formData.title,
          description: formData.description,
          thumbnail: formData.thumbnail || undefined,
          price: Number(formData.price),
          isPublished: formData.isPublished,
          courseIds: formData.selectedCourseIds,
        });
        setSuccessMsg('Learning path created successfully!');
      }
      setIsModalOpen(false);
      await fetchPaths();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || 'Failed to save learning path'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this learning path?')) return;
    try {
      await learningPathsService.deletePath(id);
      setSuccessMsg('Learning path deleted successfully!');
      await fetchPaths();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete path');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs mb-1">
            <Compass className="w-4 h-4" />
            <span>Curriculum Sequences</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface">
            Learning Paths & Bundles
          </h1>
          <p className="text-sm text-on-surface-variant">
            Bundle individual courses into step-by-step master programs and
            structured career tracks.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Learning Path
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-sm flex items-center justify-between">
          <span>{successMsg}</span>
          <button
            onClick={() => setSuccessMsg('')}
            className="text-xs underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-bg border border-border-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Total Paths</p>
            <p className="text-xl font-bold text-on-surface">{paths.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-bg border border-border-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Published Tracks</p>
            <p className="text-xl font-bold text-on-surface">
              {paths.filter((p) => p.isPublished).length}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-bg border border-border-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Enrolled Learners</p>
            <p className="text-xl font-bold text-on-surface">
              {paths.reduce((acc, p) => acc + (p._count?.enrollments || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Path List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : paths.length === 0 ? (
        <div className="text-center py-16 bg-surface-bg rounded-2xl border border-border-subtle p-8">
          <Compass className="w-12 h-12 text-on-surface-variant mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-on-surface mb-2">
            No Learning Paths Yet
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
            Create your first learning path by grouping complementary courses
            together into a structured curriculum.
          </p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Build New Path
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paths.map((path) => (
            <div
              key={path.id}
              className="bg-surface-bg rounded-2xl border border-border-subtle p-6 flex flex-col justify-between hover:border-primary/40 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          path.isPublished
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {path.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {Number(path.price) === 0
                          ? 'Free'
                          : `$${Number(path.price).toFixed(2)}`}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-on-surface">
                      {path.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(path)}
                      className="p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-all"
                      title="Edit Path"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(path.id)}
                      className="p-2 text-on-surface-variant hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                      title="Delete Path"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {path.description && (
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">
                    {path.description}
                  </p>
                )}

                {/* Courses in path preview */}
                <div className="space-y-1.5 mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Course Milestones ({path.courses?.length || 0})
                  </p>
                  {path.courses && path.courses.length > 0 ? (
                    path.courses.map((ci, idx) => (
                      <div
                        key={ci.id}
                        className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-surface-container/60"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate font-medium text-on-surface">
                            {ci.course.title}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-on-surface-variant italic">
                      No courses linked to this path yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-on-surface-variant">
                <span>{path._count?.enrollments || 0} active enrollments</span>
                <span className="text-primary font-semibold">
                  Updated {new Date(path.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-bg rounded-2xl border border-border-subtle max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <h2 className="text-lg font-bold text-on-surface">
                {editingPath
                  ? 'Edit Learning Path'
                  : 'Create New Learning Path'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Path Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Full Stack Cloud Architect Track"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-container text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline the learning objectives and career milestones students will achieve..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-container text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Bundle Price ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-container text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Status
                  </label>
                  <select
                    value={formData.isPublished ? 'published' : 'draft'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPublished: e.target.value === 'published',
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-container text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="draft">Draft (Hidden)</option>
                    <option value="published">Published (Live)</option>
                  </select>
                </div>
              </div>

              {/* Course Sequence Builder */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-on-surface">
                    Selected Course Milestones (
                    {formData.selectedCourseIds.length})
                  </label>
                  <span className="text-[11px] text-on-surface-variant">
                    Use arrows to adjust step order
                  </span>
                </div>

                {formData.selectedCourseIds.length > 0 ? (
                  <div className="space-y-2 p-3 bg-surface-container/40 rounded-xl border border-border-subtle max-h-48 overflow-y-auto">
                    {formData.selectedCourseIds.map((cid, idx) => {
                      const courseObj = myCourses.find((c) => c.id === cid);
                      return (
                        <div
                          key={cid}
                          className="flex items-center justify-between bg-surface-bg p-2.5 rounded-lg border border-border-subtle text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">
                              {idx + 1}
                            </span>
                            <span className="truncate font-medium text-on-surface">
                              {courseObj?.title || cid}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => moveCourse(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-on-surface-variant hover:text-on-surface disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveCourse(idx, 'down')}
                              disabled={
                                idx === formData.selectedCourseIds.length - 1
                              }
                              className="p-1 text-on-surface-variant hover:text-on-surface disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleCourse(cid)}
                              className="p-1 text-rose-500 hover:text-rose-700 ml-1"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-on-surface-variant italic p-3 bg-surface-container/30 rounded-xl">
                    No courses selected. Check courses below to add them to this
                    path.
                  </p>
                )}

                {/* Course Selection Checklist */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                    Add Courses from Catalog
                  </p>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto p-2 bg-surface-container/20 rounded-xl border border-border-subtle">
                    {myCourses.map((course) => {
                      const isSelected = formData.selectedCourseIds.includes(
                        course.id
                      );
                      return (
                        <button
                          type="button"
                          key={course.id}
                          onClick={() => handleToggleCourse(course.id)}
                          className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'hover:bg-surface-container text-on-surface'
                          }`}
                        >
                          <span className="truncate">{course.title}</span>
                          <span className="shrink-0 text-[11px] ml-2">
                            {isSelected ? '✓ Added' : '+ Add'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  {saving ? (
                    <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                  ) : (
                    'Save Learning Path'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
