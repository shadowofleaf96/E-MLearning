import { useState, useEffect } from 'react';
import AxiosConfig from '@/components/utils/AxiosConfig';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  isPublished: boolean;
  progress?: number;
  lastAccessedAt?: string;
  instructor: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

export const useStudentCourses = () => {
  const [data, setData] = useState<Course[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await AxiosConfig.get('/courses/enrolled');
        setData(response.data.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { data, isLoading, error };
};
