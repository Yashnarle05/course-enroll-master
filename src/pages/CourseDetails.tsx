
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    getCourseById,
    enrollInCourse,
    getUserEnrollments,
    updateCourseProgress,
  } = useCourses();

  if (!id) {
    navigate('/courses');
    return null;
  }

  const course = getCourseById(id);
  
  if (!course) {
    navigate('/courses');
    return null;
  }

  const userEnrollments = getUserEnrollments();
  const enrollment = userEnrollments.find((e) => e.courseId === id);
  const isEnrolled = !!enrollment;
  
  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    enrollInCourse(id);
  };

  const handleStartLearning = () => {
    // Update progress
    updateCourseProgress(id, 10);
    // In a real app, this would navigate to the learning environment
  };

  const levelColorMap = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-blue-100 text-blue-800',
    Advanced: 'bg-purple-100 text-purple-800',
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Course Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <Badge 
                  variant="secondary" 
                  className={`mb-2 ${levelColorMap[course.level]}`}
                >
                  {course.level}
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{course.title}</h1>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="font-medium">{course.instructor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{course.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-bold text-xl">${course.price.toFixed(2)}</p>
                </div>
                
                {isEnrolled ? (
                  <div className="w-full md:w-auto">
                    <p className="text-sm text-gray-500 mb-1">Your Progress</p>
                    <div className="flex items-center gap-2">
                      <Progress value={enrollment.progress} className="w-32" />
                      <span className="text-sm">{enrollment.progress}%</span>
                    </div>
                  </div>
                ) : null}
                
                <div className="w-full md:w-auto">
                  {isEnrolled ? (
                    <Button onClick={handleStartLearning}>
                      {enrollment.progress > 0 ? "Continue Learning" : "Start Learning"}
                    </Button>
                  ) : (
                    <Button onClick={handleEnroll}>Enroll Now</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Content */}
          <Tabs defaultValue="overview" className="bg-white rounded-lg shadow-md">
            <TabsList className="border-b w-full rounded-none justify-start p-0">
              <TabsTrigger value="overview" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Overview
              </TabsTrigger>
              <TabsTrigger value="curriculum" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Curriculum
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Reviews
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="p-6">
              <h2 className="text-xl font-semibold mb-4">About This Course</h2>
              <p className="text-gray-700 mb-6">{course.description}</p>
              
              <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Understand core principles and concepts</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Apply knowledge to real-world projects</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Build a portfolio of work to showcase your skills</span>
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Basic understanding of the subject matter</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Computer with internet access</span>
                </li>
              </ul>
            </TabsContent>
            
            <TabsContent value="curriculum" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Course Curriculum</h2>
              
              <div className="space-y-4">
                <div className="border rounded-md">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-medium">Module 1: Introduction</h3>
                    <span className="text-sm text-gray-500">3 lessons • 45 min</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Welcome to the Course</span>
                      </div>
                      <span className="text-sm text-gray-500">10:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Getting Started</span>
                      </div>
                      <span className="text-sm text-gray-500">15:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Project Setup</span>
                      </div>
                      <span className="text-sm text-gray-500">20:00</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-medium">Module 2: Core Concepts</h3>
                    <span className="text-sm text-gray-500">4 lessons • 1h 20min</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Fundamentals Explained</span>
                      </div>
                      <span className="text-sm text-gray-500">25:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Working with Data</span>
                      </div>
                      <span className="text-sm text-gray-500">20:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Student Reviews</h2>
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-700">4.9 out of 5</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Sample reviews */}
                <div className="border-b pb-6">
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                    </div>
                    <h4 className="font-medium">Amazing course!</h4>
                  </div>
                  <p className="text-gray-600 mb-2">
                    This course exceeded my expectations. The instructor explains everything clearly and the projects are very practical.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">Michael R.</span>
                    <span className="mx-2">•</span>
                    <span>2 weeks ago</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium">Good content, could use more examples</h4>
                  </div>
                  <p className="text-gray-600 mb-2">
                    The course material is solid, but I would have liked more real-world examples to illustrate the concepts.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">Sarah K.</span>
                    <span className="mx-2">•</span>
                    <span>1 month ago</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseDetails;
