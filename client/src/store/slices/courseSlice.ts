import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course } from '@/types/course.types';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    fetchCoursesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess(state, action: PayloadAction<Course[]>) {
      state.loading = false;
      state.courses = action.payload;
    },
    fetchCoursesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setCourse(state, action: PayloadAction<Course | null>) {
      state.currentCourse = action.payload;
      state.loading = false;
    },
    addCourse(state, action: PayloadAction<Course>) {
      state.courses.push(action.payload);
    },
    updateCourseInList(state, action: PayloadAction<Course>) {
      const index = state.courses.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
      if (state.currentCourse?.id === action.payload.id) {
        state.currentCourse = action.payload;
      }
    },
    deleteCourseFromList(state, action: PayloadAction<string>) {
      state.courses = state.courses.filter((c) => c.id !== action.payload);
      if (state.currentCourse?.id === action.payload) {
        state.currentCourse = null;
      }
    },
  },
});

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  setCourse,
  addCourse,
  updateCourseInList,
  deleteCourseFromList,
} = courseSlice.actions;

export default courseSlice.reducer;
