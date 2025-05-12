
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import axios from 'axios';

// Define course and enrollment types for documentation
const CourseContext = createContext({});

// Mock storage keys
const COURSES_STORAGE_KEY = 'lms_courses';
const ENROLLMENTS_STORAGE_KEY = 'lms_enrollments';

// Additional mock course data
const defaultCourses = [
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
  {
    id: '4',
    title: 'Node.js for Beginners',
    description: 'Get started with server-side JavaScript using Node.js and Express.',
    instructor: 'Michael Johnson',
    thumbnail: 'https://placehold.co/600x400?text=Node.js+Course',
    duration: '10 hours',
    level: 'Beginner',
    price: 59.99,
  },
  {
    id: '5',
    title: 'MongoDB Essentials',
    description: 'Learn how to work with MongoDB, a popular NoSQL database.',
    instructor: 'David Wilson',
    thumbnail: 'https://placehold.co/600x400?text=MongoDB+Course',
    duration: '7 hours',
    level: 'Intermediate',
    price: 49.99,
  },
  {
    id: '6',
    title: 'Full-Stack Development with MERN',
    description: 'Build complete web applications using MongoDB, Express, React, and Node.js.',
    instructor: 'Sarah Brown',
    thumbnail: 'https://placehold.co/600x400?text=MERN+Course',
    duration: '20 hours',
    level: 'Advanced',
    price: 99.99,
  },
  {
    id: '7',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design.',
    instructor: 'Emma Davis',
    thumbnail: 'https://placehold.co/600x400?text=UI/UX+Course',
    duration: '8 hours',
    level: 'Beginner',
    price: 69.99,
  },
  {
    id: '8',
    title: 'TypeScript for React Developers',
    description: 'Learn how to use TypeScript with React to build type-safe applications.',
    instructor: 'Alex Turner',
    thumbnail: 'https://placehold.co/600x400?text=TypeScript+Course',
    duration: '6 hours',
    level: 'Intermediate',
    price: 59.99,
  },
  {
    id: '9',
    title: 'Docker and Kubernetes for Developers',
    description: 'Master containerization and orchestration for modern application deployment.',
    instructor: 'Robert Chen',
    thumbnail: 'https://placehold.co/600x400?text=DevOps+Course',
    duration: '12 hours',
    level: 'Advanced',
    price: 89.99,
  }
];

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Try to fetch courses from API first
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setCourses(response.data);
          return;
        }
      } catch (error) {
        console.log('Using local courses as fallback');
      }
      
      // Fallback to local storage
      const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
      if (!storedCourses) {
        localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(defaultCourses));
        setCourses(defaultCourses);
      } else {
        try {
          const parsedCourses = JSON.parse(storedCourses);
          if (Array.isArray(parsedCourses)) {
            setCourses(parsedCourses);
          } else {
            console.error('Stored courses is not an array:', parsedCourses);
            setCourses(defaultCourses);
          }
        } catch (error) {
          console.error('Error parsing stored courses:', error);
          setCourses(defaultCourses);
        }
      }
    };

    // Load enrollments
    const fetchEnrollments = async () => {
      if (!user) {
        setEnrollments([]);
        return;
      }
      
      try {
        // Try to fetch user enrollments from API
        const response = await axios.get(`/api/enrollments/user/${user.id}`);
        if (response.data && Array.isArray(response.data)) {
          setEnrollments(response.data);
          return;
        }
      } catch (error) {
        console.log('Using local enrollments as fallback');
      }
      
      // Fallback to local storage
      const storedEnrollments = localStorage.getItem(ENROLLMENTS_STORAGE_KEY);
      if (storedEnrollments) {
        try {
          const parsedEnrollments = JSON.parse(storedEnrollments);
          if (Array.isArray(parsedEnrollments)) {
            setEnrollments(parsedEnrollments);
          } else {
            console.error('Stored enrollments is not an array:', parsedEnrollments);
            setEnrollments([]);
          }
        } catch (error) {
          console.error('Error parsing stored enrollments:', error);
          setEnrollments([]);
        }
      } else {
        setEnrollments([]);
      }
    };
    
    fetchCourses();
    fetchEnrollments();
  }, [user]);

  const saveCourses = (updatedCourses) => {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
  };

  const saveEnrollments = (updatedEnrollments) => {
    localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(updatedEnrollments));
    setEnrollments(updatedEnrollments);
  };

  const enrollInCourse = async (courseId) => {
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

    try {
      // Try to enroll via API first
      await axios.post('/api/enrollments', {
        userId: user.id,
        courseId
      });
      
      toast({
        title: "Enrollment successful",
        description: "You have successfully enrolled in the course",
      });
    } catch (error) {
      console.log('Using local enrollment as fallback');
      
      // Fallback to local storage
      const newEnrollment = {
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
    }
    
    // Refresh enrollments
    const updatedEnrollments = [...enrollments, {
      id: Date.now().toString(),
      userId: user.id,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
    }];
    
    setEnrollments(updatedEnrollments);
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

  const updateCourseProgress = async (courseId, progress) => {
    if (!user) return;

    try {
      // Try to update progress via API first
      await axios.patch(`/api/enrollments/progress`, {
        userId: user.id,
        courseId,
        progress
      });
    } catch (error) {
      console.log('Using local progress update as fallback');
      
      // Fallback to local storage
      const updatedEnrollments = enrollments.map((enrollment) => {
        if (enrollment.userId === user.id && enrollment.courseId === courseId) {
          return { ...enrollment, progress };
        }
        return enrollment;
      });
  
      saveEnrollments(updatedEnrollments);
    }
    
    // Update local state
    const updatedEnrollments = enrollments.map((enrollment) => {
      if (enrollment.userId === user.id && enrollment.courseId === courseId) {
        return { ...enrollment, progress };
      }
      return enrollment;
    });
    
    setEnrollments(updatedEnrollments);
    
    if (progress === 100) {
      toast({
        title: "Congratulations!",
        description: "You have completed this course.",
      });
    }
  };

  const getCourseById = (id) => {
    return courses.find((course) => course.id === id);
  };

  const addCourse = async (courseData) => {
    try {
      // Try to add course via API first
      const response = await axios.post('/api/courses', courseData);
      if (response.data) {
        setCourses([...courses, response.data]);
        
        toast({
          title: "Course added",
          description: "The course has been added successfully",
        });
        return;
      }
    } catch (error) {
      console.log('Using local course add as fallback');
    }
    
    // Fallback to local storage
    const newCourse = {
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

  const updateCourse = async (id, courseData) => {
    try {
      // Try to update course via API first
      await axios.put(`/api/courses/${id}`, courseData);
    } catch (error) {
      console.log('Using local course update as fallback');
    }
    
    // Update local state
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

  const deleteCourse = async (id) => {
    try {
      // Try to delete course via API first
      await axios.delete(`/api/courses/${id}`);
    } catch (error) {
      console.log('Using local course delete as fallback');
    }
    
    // Update local state
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
        courses: Array.isArray(courses) ? courses : [],
        enrollments: Array.isArray(enrollments) ? enrollments : [],
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
