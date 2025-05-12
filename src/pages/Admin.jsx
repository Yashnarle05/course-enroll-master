
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

const Admin = () => {
  const { user } = useAuth();
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    thumbnail: '',
    duration: '',
    level: 'Beginner',
    price: 0,
  });

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleLevelChange = (value) => {
    setFormData(prev => ({
      ...prev,
      level: value,
    }));
  };

  const handleAddCourse = () => {
    setIsEditing(false);
    setCurrentCourse(null);
    setFormData({
      title: '',
      description: '',
      instructor: '',
      thumbnail: 'https://placehold.co/600x400?text=New+Course',
      duration: '',
      level: 'Beginner',
      price: 0,
    });
  };

  const handleEditCourse = (course) => {
    setIsEditing(true);
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      thumbnail: course.thumbnail,
      duration: course.duration,
      level: course.level,
      price: course.price,
    });
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id);
    }
  };

  const handleSubmit = (e, onClose) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Course title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (isEditing && currentCourse) {
      updateCourse(currentCourse.id, formData);
    } else {
      addCourse(formData);
    }
    
    onClose();
  };

  const renderForm = (close) => {
    return (
      <form onSubmit={(e) => handleSubmit(e, close)} className="space-y-4 py-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Course Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter course title"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter course description"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="instructor" className="text-sm font-medium">
                Instructor
              </label>
              <Input
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                placeholder="Enter instructor name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">
                Duration
              </label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g. 6 hours"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="level" className="text-sm font-medium">
                Level
              </label>
              <Select value={formData.level} onValueChange={handleLevelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price ($)
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="thumbnail" className="text-sm font-medium">
              Thumbnail URL
            </label>
            <Input
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleInputChange}
              placeholder="Enter image URL"
            />
            <p className="text-xs text-gray-500">
              Use a placeholder image or URL to an image (e.g., https://placehold.co/600x400)
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">
            {isEditing ? 'Update Course' : 'Add Course'}
          </Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={handleAddCourse}>Add New Course</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                </DialogHeader>
                {renderForm}
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Course Management */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Course Management</h2>
            
            {courses.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Instructor</TableHead>
                      <TableHead className="hidden md:table-cell">Level</TableHead>
                      <TableHead className="hidden md:table-cell">Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell className="hidden md:table-cell">{course.instructor}</TableCell>
                        <TableCell className="hidden md:table-cell">{course.level}</TableCell>
                        <TableCell className="hidden md:table-cell">${course.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                ...
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link to={`/courses/${course.id}`}>
                                <DropdownMenuItem>View</DropdownMenuItem>
                              </Link>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => {
                                    e.preventDefault();
                                    handleEditCourse(course);
                                  }}>
                                    Edit
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[550px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Course</DialogTitle>
                                  </DialogHeader>
                                  {renderForm}
                                </DialogContent>
                              </Dialog>
                              <DropdownMenuItem 
                                className="text-red-500"
                                onSelect={(e) => {
                                  e.preventDefault();
                                  handleDeleteCourse(course.id);
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No courses available</h3>
                <p className="text-gray-600 mb-4">Add your first course to get started</p>
              </div>
            )}
          </div>
          
          {/* User Statistics (simplified) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-medium text-blue-700 mb-1">Total Courses</h3>
                <p className="text-3xl font-bold">{courses.length}</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-medium text-green-700 mb-1">Active Students</h3>
                <p className="text-3xl font-bold">--</p>
                <p className="text-xs text-gray-500 mt-1">Connect to API for real data</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-medium text-purple-700 mb-1">Total Enrollments</h3>
                <p className="text-3xl font-bold">--</p>
                <p className="text-xs text-gray-500 mt-1">Connect to API for real data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
