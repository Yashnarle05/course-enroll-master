
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCourses } from '@/contexts/CourseContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { getEnrolledCourses } = useCourses();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const enrolledCourses = getEnrolledCourses();
  
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">User Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="mx-auto">
                      <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-3xl text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium text-sm text-gray-500">Name</h3>
                      <p>{user.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm text-gray-500">Email</h3>
                      <p>{user.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm text-gray-500">Account Type</h3>
                      <p className="capitalize">{user.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Learning Summary */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Summary</CardTitle>
                  <CardDescription>Overview of your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-700 mb-1">Enrolled Courses</h3>
                      <p className="text-3xl font-bold">{enrolledCourses.length}</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium text-green-700 mb-1">Completed Courses</h3>
                      <p className="text-3xl font-bold">0</p>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-3">Recently Enrolled</h3>
                  {enrolledCourses.length > 0 ? (
                    <div className="space-y-3">
                      {enrolledCourses.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                          <div>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-sm text-gray-500">{course.instructor}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-4">You haven't enrolled in any courses yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
