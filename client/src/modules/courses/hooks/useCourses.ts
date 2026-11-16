'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  setCourse,
} from '@/store/slices/courseSlice';
import { coursesService } from '../services/courses.service';

export function useCourses() {
  const dispatch = useAppDispatch();
  const { courses, currentCourse, loading, error } = useAppSelector(
    (state) => state.course
  );

  const loadCourses = useCallback(
    async (params?: Record<string, any>) => {
      dispatch(fetchCoursesStart());
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tenantId = urlParams.get('tenantId');

        const fetchParams = { ...params };
        if (tenantId) fetchParams.tenantId = tenantId;

        const res = await coursesService.getCourses(fetchParams);
        dispatch(fetchCoursesSuccess(res.data));
        return { success: true, data: res.data, meta: (res as any).meta };
      } catch (err: any) {
        const errMsg = err.response?.data?.message || 'Failed to load courses';
        dispatch(fetchCoursesFailure(errMsg));
        return { success: false, error: errMsg };
      }
    },
    [dispatch]
  );

  const loadEnrolledCourses = useCallback(async () => {
    dispatch(fetchCoursesStart());
    try {
      const res = await coursesService.getEnrolledCourses();
      dispatch(fetchCoursesSuccess(res.data));
      return { success: true };
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || 'Failed to load enrolled courses';
      dispatch(fetchCoursesFailure(errMsg));
      return { success: false, error: errMsg };
    }
  }, [dispatch]);

  const loadCourseDetail = useCallback(
    async (id: string) => {
      dispatch(fetchCoursesStart());
      try {
        const res = await coursesService.getCourse(id);
        dispatch(setCourse(res.data));
        return { success: true, data: res.data };
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message || 'Failed to load course details';
        dispatch(fetchCoursesFailure(errMsg));
        return { success: false, error: errMsg };
      }
    },
    [dispatch]
  );

  const enroll = useCallback(async (id: string) => {
    try {
      await coursesService.enrollInCourse(id);
      return { success: true };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Enrollment failed';
      return { success: false, error: errMsg };
    }
  }, []);

  const deleteCourseAdmin = useCallback(async (id: string) => {
    try {
      await coursesService.deleteCourse(id);
      return { success: true };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Delete failed';
      return { success: false, error: errMsg };
    }
  }, []);

  const toggleCoursePublish = useCallback(
    async (id: string, isPublished: boolean) => {
      try {
        await coursesService.publishCourse(id, isPublished);
        return { success: true };
      } catch (err: any) {
        const errMsg = err.response?.data?.message || 'Publish toggle failed';
        return { success: false, error: errMsg };
      }
    },
    []
  );

  return {
    courses,
    currentCourse,
    loading,
    error,
    loadCourses,
    loadEnrolledCourses,
    loadCourseDetail,
    enroll,
    deleteCourseAdmin,
    toggleCoursePublish,
  };
}
