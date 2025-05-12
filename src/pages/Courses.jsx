
import React, { useState, useEffect } from 'react';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import CourseCard from '@/components/courses/CourseCard';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Courses = () => {
  const { courses, enrollInCourse } = useCourses();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [localCourses, setLocalCourses] = useState([]);

  // Ensure courses is always an array before using it
  useEffect(() => {
    if (courses && Array.isArray(courses)) {
      setLocalCourses(courses);
    } else {
      console.error('Courses is not an array:', courses);
      setLocalCourses([]);
    }
  }, [courses]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLevelFilterChange = (value) => {
    setLevelFilter(value);
  };
  
  const handlePriceFilterChange = (value) => {
    setPriceFilter(value);
  };
  
  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleEnroll = (courseId) => {
    enrollInCourse(courseId);
  };

  // Apply filters and sorting on the local courses array
  const filteredCourses = localCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    
    const matchesPrice = 
      priceFilter === 'all' || 
      (priceFilter === 'free' && course.price === 0) ||
      (priceFilter === 'paid' && course.price > 0) ||
      (priceFilter === 'under25' && course.price < 25) ||
      (priceFilter === 'under50' && course.price < 50) ||
      (priceFilter === 'over50' && course.price >= 50);
    
    return matchesSearch && matchesLevel && matchesPrice;
  });
  
  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    } else if (sortBy === 'price-high') {
      return b.price - a.price;
    } else if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'title-desc') {
      return b.title.localeCompare(a.title);
    }
    return 0; // default, no sorting
  });

  // Group courses by level for featured section, ensuring we work with arrays
  const beginnerCourses = localCourses.filter(course => course.level === 'Beginner').slice(0, 3);
  const intermediateCourses = localCourses.filter(course => course.level === 'Intermediate').slice(0, 3);
  const advancedCourses = localCourses.filter(course => course.level === 'Advanced').slice(0, 3);

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Featured Courses Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Learning Paths</h2>
            
            <div className="grid grid-cols-1 gap-8">
              {/* Beginner Path */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Badge variant="outline" className="bg-blue-500 text-white mr-3">
                    Beginner
                  </Badge>
                  <h3 className="text-xl font-semibold">Start Your Learning Journey</h3>
                </div>
                <p className="text-gray-600 mb-6">Perfect for those just getting started. Master the fundamentals and build a solid foundation.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {beginnerCourses.length > 0 ? (
                    beginnerCourses.map(course => (
                      <div key={course.id} className="bg-white p-4 rounded-md shadow">
                        <h4 className="font-medium text-lg mb-2 truncate">{course.title}</h4>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleEnroll(course.id)}
                        >
                          Explore
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-3 text-center py-4">No beginner courses available.</p>
                  )}
                </div>
              </div>
              
              {/* Intermediate Path */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Badge variant="outline" className="bg-green-600 text-white mr-3">
                    Intermediate
                  </Badge>
                  <h3 className="text-xl font-semibold">Level Up Your Skills</h3>
                </div>
                <p className="text-gray-600 mb-6">Ready for more challenges? These courses will expand your knowledge and practical abilities.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {intermediateCourses.length > 0 ? (
                    intermediateCourses.map(course => (
                      <div key={course.id} className="bg-white p-4 rounded-md shadow">
                        <h4 className="font-medium text-lg mb-2 truncate">{course.title}</h4>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleEnroll(course.id)}
                        >
                          Explore
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-3 text-center py-4">No intermediate courses available.</p>
                  )}
                </div>
              </div>
              
              {/* Advanced Path */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Badge variant="outline" className="bg-purple-600 text-white mr-3">
                    Advanced
                  </Badge>
                  <h3 className="text-xl font-semibold">Master Advanced Concepts</h3>
                </div>
                <p className="text-gray-600 mb-6">Take your expertise to the next level with our advanced courses for seasoned learners.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {advancedCourses.length > 0 ? (
                    advancedCourses.map(course => (
                      <div key={course.id} className="bg-white p-4 rounded-md shadow">
                        <h4 className="font-medium text-lg mb-2 truncate">{course.title}</h4>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleEnroll(course.id)}
                        >
                          Explore
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-3 text-center py-4">No advanced courses available.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
          
          <h1 className="text-3xl font-bold mb-8">Course Catalog</h1>
          
          {/* Enhanced Filters */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Search & Filter</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <Select value={levelFilter} onValueChange={handleLevelFilterChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={priceFilter} onValueChange={handlePriceFilterChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="under25">Under $25</SelectItem>
                    <SelectItem value="under50">Under $50</SelectItem>
                    <SelectItem value="over50">$50 & Above</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {sortedCourses.length} course{sortedCourses.length !== 1 ? 's' : ''} found
              </div>
              
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="title-asc">Title: A to Z</SelectItem>
                  <SelectItem value="title-desc">Title: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {sortedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onEnroll={() => handleEnroll(course.id)}
                  showEnrollButton={!!user}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">No courses found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Courses;
