
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import MainLayout from '@/components/layout/MainLayout';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, CheckCircle, Clock } from 'lucide-react';

const MyLearning = () => {
  const { user } = useAuth();
  const { getEnrolledCourses, getUserEnrollments, updateCourseProgress } = useCourses();
  const [activeTab, setActiveTab] = useState('all');
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  const enrolledCourses = getEnrolledCourses();
  const userEnrollments = getUserEnrollments();

  const getEnrollmentForCourse = (courseId) => {
    return userEnrollments.find(enrollment => enrollment.courseId === courseId);
  };

  const handleContinueLearning = (courseId) => {
    // In a real app, this would navigate to the course content
    console.log('Continue learning for course:', courseId);
  };

  const handleIncrementProgress = (courseId) => {
    const enrollment = getEnrollmentForCourse(courseId);
    if (enrollment) {
      const newProgress = Math.min(100, enrollment.progress + 10);
      updateCourseProgress(courseId, newProgress);
    }
  };

  // Filter courses based on active tab
  const filteredCourses = enrolledCourses.filter(course => {
    if (activeTab === 'all') return true;
    
    const enrollment = getEnrollmentForCourse(course.id);
    if (!enrollment) return false;
    
    if (activeTab === 'inProgress') {
      return enrollment.progress > 0 && enrollment.progress < 100;
    } else if (activeTab === 'completed') {
      return enrollment.progress === 100;
    }
    return false;
  });

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Learning</h1>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b mb-6">
              <TabsList className="bg-transparent">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">All Courses</TabsTrigger>
                <TabsTrigger value="inProgress" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">In Progress</TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Completed</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab}>
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => {
                    const enrollment = getEnrollmentForCourse(course.id);
                    const progress = enrollment ? enrollment.progress : 0;
                    const isCompleted = progress === 100;
                    
                    return (
                      <Card key={course.id} className="overflow-hidden">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/600x400?text=Course";
                          }}
                        />
                        <CardHeader>
                          <CardTitle>{course.title}</CardTitle>
                          <p className="text-sm text-gray-500">by {course.instructor}</p>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{course.duration}</span>
                            <span className="mx-2">•</span>
                            <BookOpen className="h-4 w-4 mr-2" />
                            <span>{course.level}</span>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleIncrementProgress(course.id)}
                          >
                            {isCompleted ? (
                              <><CheckCircle className="h-4 w-4 mr-2" /> Completed</>
                            ) : (
                              <>+ Progress</>
                            )}
                          </Button>
                          
                          <Button 
                            variant={isCompleted ? "outline" : "default"} 
                            size="sm"
                            onClick={() => {
                              const button = document.getElementById(`continue-${course.id}`);
                              if (button) {
                                button.classList.add('animate-pulse');
                                setTimeout(() => button.classList.remove('animate-pulse'), 1000);
                              }
                              handleContinueLearning(course.id);
                            }}
                            id={`continue-${course.id}`}
                          >
                            <Play className="h-4 w-4 mr-2" /> 
                            {isCompleted ? 'Review' : 'Continue'}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <h3 className="text-xl font-medium mb-2">No courses found</h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'all' 
                      ? "You haven't enrolled in any courses yet." 
                      : activeTab === 'inProgress' 
                        ? "You don't have any courses in progress." 
                        : "You haven't completed any courses yet."}
                  </p>
                  <Button onClick={() => window.location.href = '/courses'}>
                    Browse Courses
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyLearning;
