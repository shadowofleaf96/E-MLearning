'use client';

import React, { useState, useEffect } from 'react';
import {
  reviewsService,
  CourseReviewsData,
} from '../services/reviews.service';
import { toast } from 'react-toastify';
import { useAuth } from '@/modules/auth/hooks/useAuth';

interface Props {
  courseId: string;
  isEnrolled?: boolean;
}

export function CourseReviewsSection({ courseId, isEnrolled }: Props) {
  const { user } = useAuth();
  const [data, setData] = useState<CourseReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewsService.getCourseReviews(courseId);
      if (res?.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await reviewsService.createReview({
        courseId,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success('Thank you! Your review has been submitted.');
      setShowForm(false);
      setComment('');
      fetchReviews();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number, interactive = false, onSelect?: (n: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => interactive && onSelect && onSelect(star)}
            className={`material-symbols-outlined text-[20px] ${
              star <= count ? 'text-amber-400' : 'text-surface-container-high'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            style={{ fontVariationSettings: star <= count ? "'FILL' 1" : "'FILL' 0" }}
          >
            star
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8 pt-8 border-t border-border-subtle">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="font-headline-md text-on-surface">Student Reviews & Ratings</h3>
          <p className="text-on-surface-variant text-sm">
            Read authentic feedback from learners who took this course.
          </p>
        </div>
        {user && isEnrolled && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-white font-bold rounded-xl text-sm hover:shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">rate_review</span>
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-8 p-6 bg-surface-container-low rounded-2xl border border-secondary/30 shadow-sm animate-fadeIn"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-base text-on-surface">Share Your Experience</h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-on-surface-variant hover:text-on-surface"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
              Rating
            </label>
            <div className="flex items-center gap-3">
              {renderStars(rating, true, (n) => setRating(n))}
              <span className="text-sm font-bold text-on-surface">{rating} out of 5 stars</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
              Your Review (Optional)
            </label>
            <textarea
              placeholder="What did you like most about this course? How did it help you learn?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-28 p-3 bg-surface-container-lowest border border-border-subtle rounded-xl text-sm text-on-surface focus:outline-none focus:border-secondary resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-secondary text-white font-bold rounded-lg text-sm hover:shadow-md transition-all disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Overview Score Card */}
      {data && data.stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-surface-container-lowest rounded-2xl border border-border-subtle">
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border-subtle pb-6 md:pb-0 md:pr-6">
            <div className="text-5xl font-black text-on-surface mb-2">
              {data.stats.averageRating > 0 ? data.stats.averageRating.toFixed(1) : '—'}
            </div>
            {renderStars(Math.round(data.stats.averageRating))}
            <span className="text-xs text-on-surface-variant mt-2 font-medium">
              Based on {data.stats.total} {data.stats.total === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <div className="md:col-span-2 flex flex-col justify-center space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = data.stats.distribution[stars] || 0;
              const pct = data.stats.total > 0 ? (count / data.stats.total) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-on-surface-variant font-medium flex items-center gap-1">
                    {stars} <span className="text-[12px]">★</span>
                  </span>
                  <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-on-surface-variant font-medium">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review List */}
      {loading ? (
        <div className="py-8 flex justify-center text-on-surface-variant text-sm">
          <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
          Loading reviews...
        </div>
      ) : !data || data.reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-on-surface-variant bg-surface-container-low rounded-2xl border border-border-subtle">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-40">grade</span>
          <p className="text-sm font-semibold">No reviews yet</p>
          <p className="text-xs text-on-surface-variant mt-1">
            Be the first student to review this course!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-surface-container-lowest rounded-xl border border-border-subtle"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center text-xs">
                    {rev.student.avatar ? (
                      <img
                        src={rev.student.avatar}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      rev.student.firstName[0]
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-on-surface">
                      {rev.student.firstName} {rev.student.lastName}
                    </h5>
                    <span className="text-[11px] text-on-surface-variant">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {renderStars(rev.rating)}
              </div>
              {rev.comment && (
                <p className="text-sm text-on-surface-variant leading-relaxed pl-12">
                  {rev.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
