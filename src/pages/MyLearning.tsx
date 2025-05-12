
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import CourseCard from '@/components/courses/CourseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const MyLearning: React.FC = () => {
  const { user } = useAuth();
  const { 
    getEnrolledCourses, 
    getUserEnrollments,
  } = useCourses();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  const enrolledCourses = getEnrolledCourses();
  const userEnrollments = getUserEnrollments();

  // Match courses with their progress
  const coursesWithProgress = enrolledCourses.map(course => {
    const enrollment = userEnrollments.find(e => e.courseId === course.id);
    return {
      ...course,
      progress: enrollment ? enrollment.progress : 0
    };
  });

  // Split courses into in progress and completed
  const inProgressCourses = coursesWithProgress.filter(course => course.progress > 0 && course.progress < 100);
  const completedCourses = coursesWithProgress.filter(course => course.progress === 100);
  const notStartedCourses = coursesWithProgress.filter(course => course.progress === 0);

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Learning</h1>

          {enrolledCourses.length > 0 ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesWithProgress.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      isEnrolled={true}
                      progress={course.progress}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="in-progress">
                {inProgressCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inProgressCourses.map((course) => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        isEnrolled={true}
                        progress={course.progress}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <h3 className="text-xl font-medium mb-2">No courses in progress</h3>
                    <p className="text-gray-600 mb-4">
                      You have not started any of your enrolled courses yet.
                    </p>
                    <Link to="/courses">
                      <Button variant="outline">Browse Courses</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed">
                {completedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedCourses.map((course) => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        isEnrolled={true}
                        progress={course.progress}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <h3 className="text-xl font-medium mb-2">No completed courses</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't completed any courses yet. Keep learning!
                    </p>
                    {inProgressCourses.length > 0 ? (
                      <Button variant="outline" onClick={() => document.querySelector('[data-value="in-progress"]')?.click()}>
                        View In-Progress Courses
                      </Button>
                    ) : (
                      <Link to="/courses">
                        <Button variant="outline">Browse Courses</Button>
                      </Link>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">No enrolled courses</h3>
              <p className="text-gray-600 mb-4">
                You haven't enrolled in any courses yet. Browse our catalog to find courses.
              </p>
              <Link to="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MyLearning;
