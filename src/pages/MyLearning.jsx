
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import MainLayout from '@/components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MyLearning = () => {
  const { user } = useAuth();
  const { courses, getUserEnrollments, updateCourseProgress } = useCourses();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Get user enrollments
  const userEnrollments = getUserEnrollments();

  // Create enrolled courses with progress
  const enrolledCourses = userEnrollments.map(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId);
    return {
      ...course,
      progress: enrollment.progress,
      lastActivity: enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : 'Not started',
    };
  });

  // Filter courses based on tab
  const filteredCourses = React.useMemo(() => {
    if (activeTab === 'all') return enrolledCourses;
    if (activeTab === 'in-progress') return enrolledCourses.filter(course => course.progress > 0 && course.progress < 100);
    if (activeTab === 'completed') return enrolledCourses.filter(course => course.progress === 100);
    if (activeTab === 'not-started') return enrolledCourses.filter(course => course.progress === 0);
    return enrolledCourses;
  }, [activeTab, enrolledCourses]);

  const handleContinueCourse = (courseId) => {
    // In a real app, this would navigate to the specific lesson the user was on
    console.log(`Continuing course: ${courseId}`);
    
    // For demo purposes, increase progress by 25% each time
    const course = enrolledCourses.find(c => c.id === courseId);
    if (course) {
      const newProgress = Math.min(course.progress + 25, 100);
      updateCourseProgress(courseId, newProgress);
    }
    
    // Navigate to course details
    navigate(`/courses/${courseId}`);
  };

  const handleContinueLearning = () => {
    // Find the most recently accessed course
    const mostRecentCourse = enrolledCourses.reduce((prev, current) => {
      // In a real app, you would compare timestamps
      return (prev.progress > current.progress) ? prev : current;
    }, enrolledCourses[0]);
    
    if (mostRecentCourse) {
      handleContinueCourse(mostRecentCourse.id);
    }
  };

  const navigateToCourses = () => {
    navigate('/courses');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Learning</h1>
            <p className="text-gray-600">Track your progress and continue where you left off</p>
          </div>
          
          {enrolledCourses.length > 0 && (
            <Button 
              className="mt-4 md:mt-0" 
              onClick={handleContinueLearning}
            >
              Continue Learning
            </Button>
          )}
        </div>

        {enrolledCourses.length > 0 ? (
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="all">All Courses</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="not-started">Not Started</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden bg-gray-100">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>Instructor: {course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-500">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <p className="mt-4 text-sm text-gray-500">Last activity: {course.lastActivity}</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleContinueCourse(course.id)}
                      >
                        {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredCourses.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No courses found</h3>
                  <p className="text-gray-600 mb-4">Try selecting a different filter</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">No enrolled courses yet</h2>
            <p className="text-gray-600 mb-6">Browse our catalog and enroll in your first course</p>
            <Button onClick={navigateToCourses}>
              Browse Courses
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyLearning;
