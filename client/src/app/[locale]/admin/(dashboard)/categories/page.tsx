'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FolderTree,
  Tag as TagIcon,
  Plus,
  Trash2,
  ChevronRight,
  Layers,
} from 'lucide-react';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string | null;
  parent?: { id: string; name: string };
  children?: CategoryItem[];
  _count?: { courses: number };
}

interface TagItem {
  id: string;
  name: string;
  slug: string;
  _count?: { courses: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catParentId, setCatParentId] = useState<string>('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Tag creation state
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [catRes, tagsRes] = await Promise.all([
        api.get(ENDPOINTS.CATEGORIES.LIST),
        api.get(ENDPOINTS.TAGS.LIST),
      ]);
      setCategories(catRes.data?.data || []);
      setTags(tagsRes.data?.data || []);
    } catch {
      toast.error('Failed to load taxonomy data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      toast.error('Category name is required');
      return;
    }
    try {
      setIsSavingCategory(true);
      await api.post(ENDPOINTS.CATEGORIES.CREATE, {
        name: catName.trim(),
        description: catDescription.trim() || undefined,
        parentId: catParentId ? catParentId : null,
      });
      toast.success('Category created successfully');
      setCatName('');
      setCatDescription('');
      setCatParentId('');
      setIsCategoryModalOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to create category');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (
      !window.confirm(`Are you sure you want to delete category "${name}"?`)
    ) {
      return;
    }
    try {
      await api.delete(ENDPOINTS.CATEGORIES.DELETE(id));
      toast.success('Category deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    try {
      setIsCreatingTag(true);
      await api.post(ENDPOINTS.TAGS.CREATE, {
        name: newTagName.trim(),
      });
      toast.success('Tag created');
      setNewTagName('');
      fetchData();
    } catch {
      toast.error('Failed to create tag');
    } finally {
      setIsCreatingTag(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await api.delete(ENDPOINTS.TAGS.DELETE(id));
      toast.success('Tag deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete tag');
    }
  };

  const parentCategories = categories.filter((c) => !c.parentId);

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  return (
    <div className="w-full max-w-container-max mx-auto space-y-8 animate-in fade-in duration-300 selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-secondary">Taxonomy</span>
          </div>
          <h1 className="font-headline-lg text-3xl font-bold text-on-surface">
            Categories &amp; Tags Management
          </h1>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            Structure course discovery with hierarchical parent categories,
            subcategories, and keyword tags.
          </p>
        </div>
        <button
          onClick={() => {
            setCatName('');
            setCatDescription('');
            setCatParentId('');
            setIsCategoryModalOpen(true);
          }}
          className="px-4 py-2.5 bg-secondary text-white font-bold text-sm rounded-xl hover:bg-secondary/90 transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Categories Hierarchy */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-bg/50">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-secondary" />
                <h3 className="font-headline-md text-lg font-bold text-on-surface">
                  Category Hierarchy Tree
                </h3>
              </div>
              <span className="text-xs font-bold text-on-surface-variant">
                {categories.length} Categories Total
              </span>
            </div>

            <div className="divide-y divide-border-subtle">
              {parentCategories.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant text-sm font-medium">
                  No categories created yet. Click "Add Category" to get
                  started.
                </div>
              ) : (
                parentCategories.map((parent) => {
                  const subcategories = categories.filter(
                    (c) => c.parentId === parent.id
                  );
                  return (
                    <div
                      key={parent.id}
                      className="p-5 hover:bg-surface-container-lowest transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm shrink-0">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-on-surface flex items-center gap-2">
                              {parent.name}
                              <span className="text-xs font-normal text-on-surface-variant">
                                ({parent.slug})
                              </span>
                            </div>
                            {parent.description && (
                              <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                                {parent.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-md">
                            {parent._count?.courses || 0} Courses
                          </span>
                          <button
                            onClick={() => {
                              setCatName('');
                              setCatDescription('');
                              setCatParentId(parent.id);
                              setIsCategoryModalOpen(true);
                            }}
                            className="text-xs font-bold text-secondary hover:underline"
                          >
                            + Subcategory
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCategory(parent.id, parent.name)
                            }
                            className="p-1.5 text-on-surface-variant hover:text-error transition-colors rounded"
                            title="Delete category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subcategories list */}
                      {subcategories.length > 0 && (
                        <div className="mt-3 ml-12 pl-4 border-l-2 border-border-subtle space-y-2">
                          {subcategories.map((sub) => (
                            <div
                              key={sub.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-surface-bg hover:bg-surface-container-low transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                <span className="text-xs font-semibold text-on-surface">
                                  {sub.name}
                                </span>
                                <span className="text-[11px] text-on-surface-variant font-mono">
                                  /{sub.slug}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-on-surface-variant">
                                  {sub._count?.courses || 0} Courses
                                </span>
                                <button
                                  onClick={() =>
                                    handleDeleteCategory(sub.id, sub.name)
                                  }
                                  className="text-on-surface-variant hover:text-error p-1 transition-colors"
                                  title="Delete subcategory"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Tags Management */}
        <div className="space-y-6">
          <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TagIcon className="w-5 h-5 text-secondary" />
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                Keyword Tags
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Tags allow cross-cutting categorization across courses (e.g.
              #Beginner, #Certification, #Fullstack).
            </p>

            {/* Create Tag Form */}
            <form onSubmit={handleCreateTag} className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag (e.g. Next.js)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-border-subtle text-xs font-medium outline-none focus:border-secondary"
              />
              <button
                type="submit"
                disabled={isCreatingTag || !newTagName.trim()}
                className="px-3.5 py-2 bg-secondary text-white font-bold text-xs rounded-xl hover:bg-secondary/90 transition-all disabled:opacity-50"
              >
                Add
              </button>
            </form>

            {/* Tags Pills List */}
            <div className="flex flex-wrap gap-2">
              {tags.length === 0 ? (
                <p className="text-xs text-on-surface-variant py-4">
                  No tags added yet. Type a tag name above to create one.
                </p>
              ) : (
                tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-lg text-xs font-semibold text-on-surface border border-border-subtle group hover:border-secondary transition-colors"
                  >
                    <span>#{tag.name}</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      ({tag._count?.courses || 0})
                    </span>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="text-on-surface-variant hover:text-error transition-colors ml-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="max-w-md bg-surface-card border-border-subtle">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-on-surface">
              {catParentId ? 'Add Subcategory' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCategory} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Category Name
              </label>
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Cloud Computing"
                className="w-full px-4 py-2.5 rounded-xl border border-border-subtle text-sm outline-none focus:border-secondary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Parent Category (Optional)
              </label>
              <select
                value={catParentId}
                onChange={(e) => setCatParentId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border-subtle text-sm outline-none focus:border-secondary bg-surface-card"
              >
                <option value="">None (Top-Level Parent)</option>
                {parentCategories.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                value={catDescription}
                onChange={(e) => setCatDescription(e.target.value)}
                placeholder="Brief summary of topics in this category..."
                rows={3}
                className="w-full p-3 rounded-xl border border-border-subtle text-sm outline-none focus:border-secondary resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingCategory}
                className="px-5 py-2 bg-secondary text-white font-bold text-xs rounded-xl hover:bg-secondary/90 transition-all shadow-sm"
              >
                {isSavingCategory ? 'Saving...' : 'Create Category'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
