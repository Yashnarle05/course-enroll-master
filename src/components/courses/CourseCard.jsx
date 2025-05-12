
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CourseCard = ({ course, isEnrolled = false, progress = 0, onEnroll, showEnrollButton = false }) => {
  const levelColorMap = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-blue-100 text-blue-800',
    Advanced: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="course-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-48 object-cover"
        />
        {isEnrolled && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-3 py-1">
            <div className="flex items-center">
              <div className="flex-grow h-1 bg-gray-300 rounded-full mr-2">
                <div
                  className="h-1 bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs">{progress}%</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Badge 
            variant="secondary" 
            className={`${levelColorMap[course.level]}`}
          >
            {course.level}
          </Badge>
          <span className="font-bold text-lg">${course.price.toFixed(2)}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
          {course.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
            <span>{course.instructor}</span>
            <span>{course.duration}</span>
          </div>
          
          <div className="flex space-x-2">
            <Link to={`/courses/${course.id}`} className="flex-grow">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
            
            {showEnrollButton && !isEnrolled && (
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  onEnroll(course.id);
                }}
                className="flex-grow"
              >
                Enroll Now
              </Button>
            )}
            
            {isEnrolled && (
              <Button variant="secondary" className="w-full">
                Continue Learning
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
