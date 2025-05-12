
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import CourseCard from '@/components/courses/CourseCard';
import MainLayout from '@/components/layout/MainLayout';

const Index: React.FC = () => {
  const { courses } = useCourses();
  const { user } = useAuth();
  
  const featuredCourses = courses.slice(0, 3);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero-pattern">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Unlock Your Potential with Online Learning
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Access high-quality courses designed to help you master new skills, advance your career, and explore your passions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Courses
                </Button>
              </Link>
              {!user && (
                <Link to="/register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Join Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://placehold.co/600x400?text=Learning+Platform"
              alt="Learning Platform"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Courses</h2>
            <Link to="/courses" className="text-primary hover:underline font-medium">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose LearnHub?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert-Led Courses</h3>
              <p className="text-gray-600">
                Learn from industry professionals with real-world experience and proven expertise in their fields.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Learn at Your Pace</h3>
              <p className="text-gray-600">
                Access course content anytime, anywhere. Learn on your schedule, at your own pace.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Support</h3>
              <p className="text-gray-600">
                Join a community of learners and instructors for discussions, support, and networking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of students who are already learning and advancing their careers with LearnHub.
          </p>
          <Link to={user ? "/courses" : "/register"}>
            <Button variant="secondary" size="lg">
              {user ? "Explore Courses" : "Get Started"}
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
