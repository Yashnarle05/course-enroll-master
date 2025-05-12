
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
}

interface CourseContextType {
  courses: Course[];
  enrollments: Enrollment[];
  enrollInCourse: (courseId: string) => void;
  getUserEnrollments: () => Enrollment[];
  getEnrolledCourses: () => Course[];
  updateCourseProgress: (courseId: string, progress: number) => void;
  getCourseById: (id: string) => Course | undefined;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, courseData: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
}

const CourseContext = createContext<CourseContextType>({} as CourseContextType);

// Mock storage keys
const COURSES_STORAGE_KEY = 'lms_courses';
const ENROLLMENTS_STORAGE_KEY = 'lms_enrollments';

// Mock course data
const defaultCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the basics of React, including components, props, and state.',
    instructor: 'John Doe',
    thumbnail: 'https://placehold.co/600x400?text=React+Course',
    duration: '6 hours',
    level: 'Beginner',
    price: 49.99,
  },
  {
    id: '2',
    title: 'Advanced JavaScript Patterns',
    description: 'Master advanced JavaScript concepts like closures, prototypes, and design patterns.',
    instructor: 'Jane Smith',
    thumbnail: 'https://placehold.co/600x400?text=JavaScript+Course',
    duration: '8 hours',
    level: 'Advanced',
    price: 79.99,
  },
  {
    id: '3',
    title: 'CSS Flexbox & Grid Mastery',
    description: 'Master modern CSS layout techniques with Flexbox and Grid.',
    instructor: 'Maria Rodriguez',
    thumbnail: 'https://placehold.co/600x400?text=CSS+Course',
    duration: '5 hours',
    level: 'Intermediate',
    price: 39.99,
  },
];

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize courses if none exist
    const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!storedCourses) {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(defaultCourses));
      setCourses(defaultCourses);
    } else {
      setCourses(JSON.parse(storedCourses));
    }

    // Load enrollments
    const storedEnrollments = localStorage.getItem(ENROLLMENTS_STORAGE_KEY);
    if (storedEnrollments) {
      setEnrollments(JSON.parse(storedEnrollments));
    }
  }, []);

  const saveCourses = (updatedCourses: Course[]) => {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
  };

  const saveEnrollments = (updatedEnrollments: Enrollment[]) => {
    localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(updatedEnrollments));
    setEnrollments(updatedEnrollments);
  };

  const enrollInCourse = (courseId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to enroll in courses",
        variant: "destructive",
      });
      return;
    }

    // Check if already enrolled
    const isEnrolled = enrollments.some(
      (enrollment) => enrollment.userId === user.id && enrollment.courseId === courseId
    );

    if (isEnrolled) {
      toast({
        title: "Already enrolled",
        description: "You are already enrolled in this course",
        variant: "destructive",
      });
      return;
    }

    const newEnrollment: Enrollment = {
      id: Date.now().toString(),
      userId: user.id,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
    };

    const updatedEnrollments = [...enrollments, newEnrollment];
    saveEnrollments(updatedEnrollments);

    toast({
      title: "Enrollment successful",
      description: "You have successfully enrolled in the course",
    });
  };

  const getUserEnrollments = () => {
    if (!user) return [];
    return enrollments.filter((enrollment) => enrollment.userId === user.id);
  };

  const getEnrolledCourses = () => {
    if (!user) return [];
    const userEnrollments = getUserEnrollments();
    return courses.filter((course) => 
      userEnrollments.some((enrollment) => enrollment.courseId === course.id)
    );
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    if (!user) return;

    const updatedEnrollments = enrollments.map((enrollment) => {
      if (enrollment.userId === user.id && enrollment.courseId === courseId) {
        return { ...enrollment, progress };
      }
      return enrollment;
    });

    saveEnrollments(updatedEnrollments);
  };

  const getCourseById = (id: string) => {
    return courses.find((course) => course.id === id);
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
    };

    const updatedCourses = [...courses, newCourse];
    saveCourses(updatedCourses);

    toast({
      title: "Course added",
      description: "The course has been added successfully",
    });
  };

  const updateCourse = (id: string, courseData: Partial<Course>) => {
    const updatedCourses = courses.map((course) => {
      if (course.id === id) {
        return { ...course, ...courseData };
      }
      return course;
    });

    saveCourses(updatedCourses);

    toast({
      title: "Course updated",
      description: "The course has been updated successfully",
    });
  };

  const deleteCourse = (id: string) => {
    const updatedCourses = courses.filter((course) => course.id !== id);
    saveCourses(updatedCourses);

    // Also delete related enrollments
    const updatedEnrollments = enrollments.filter(
      (enrollment) => enrollment.courseId !== id
    );
    saveEnrollments(updatedEnrollments);

    toast({
      title: "Course deleted",
      description: "The course has been deleted successfully",
    });
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        enrollments,
        enrollInCourse,
        getUserEnrollments,
        getEnrolledCourses,
        updateCourseProgress,
        getCourseById,
        addCourse,
        updateCourse,
        deleteCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => useContext(CourseContext);
