'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { courseService } from '@/lib/courseService';
import { Course } from '@/types/course';
import CourseCard from '@/components/CourseCard';
import CourseForm from '@/components/CourseForm';
import FileUpload from '@/components/FileUpload';
import { Plus, Search, Filter } from 'lucide-react';

export default function CoursesPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadCourseId, setUploadCourseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user) {
      loadCourses();
    }
  }, [loading, isAuthenticated, user, router]);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [courses, searchTerm]);

  const loadCourses = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let coursesData: Course[];
      
      if (user.role === 'lecturer') {
        coursesData = await courseService.getCourses();
      } else if (user.role === 'student') {
        coursesData = await courseService.getCourses();
      } else {
        coursesData = await courseService.getCourses();
      }
      
      setCourses(coursesData);
    } catch (err: any) {
      setError('Failed to load courses. Please try again.');
      console.error('Error loading courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = async (courseData: any) => {
    try {
      await courseService.createCourse(courseData);
      setShowCourseForm(false);
      loadCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to create course. Please try again.');
      console.error('Error creating course:', err);
    }
  };

  const handleUpdateCourse = async (courseData: any) => {
    if (!editingCourse) return;
    
    try {
      await courseService.updateCourse(editingCourse.id.toString(), courseData);
      setEditingCourse(null);
      setShowCourseForm(false);
      loadCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to update course. Please try again.');
      console.error('Error updating course:', err);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await courseService.deleteCourse(courseId.toString());
      loadCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to delete course. Please try again.');
      console.error('Error deleting course:', err);
    }
  };

  const handleEnrollInCourse = async (courseId: number) => {
    try {
      await courseService.enrollInCourse(courseId.toString());
      loadCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to enroll in course. Please try again.');
      console.error('Error enrolling in course:', err);
    }
  };

  const handleDropCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to drop this course?')) return;
    
    try {
      await courseService.dropCourse(courseId.toString());
      loadCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to drop course. Please try again.');
      console.error('Error dropping course:', err);
    }
  };

  const handleUploadSyllabus = (courseId: number) => {
    setUploadCourseId(courseId.toString());
    setShowFileUpload(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!uploadCourseId) return;
    
    try {
      await courseService.uploadSyllabus(uploadCourseId, file);
      setShowFileUpload(false);
      setUploadCourseId(null);
      loadCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to upload syllabus. Please try again.');
      console.error('Error uploading syllabus:', err);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getPageTitle = () => {
    switch (user.role) {
      case 'student':
        return 'Browse Courses';
      case 'lecturer':
        return 'My Courses';
      case 'admin':
        return 'Course Management';
      default:
        return 'Courses';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
              <p className="text-gray-600">
                {user.role === 'student' && 'Browse and enroll in available courses'}
                {user.role === 'lecturer' && 'Manage your courses and upload syllabi'}
                {user.role === 'admin' && 'Oversee all courses and enrollments'}
              </p>
            </div>
            
            {user.role === 'lecturer' && (
              <button
                onClick={() => setShowCourseForm(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              userRole={user.role}
              onEnroll={handleEnrollInCourse}
              onDrop={handleDropCourse}
              onEdit={(course) => {
                setEditingCourse(course);
                setShowCourseForm(true);
              }}
              onDelete={handleDeleteCourse}
              onUploadSyllabus={handleUploadSyllabus}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No courses found' : 'No courses available'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Check back later for new courses'
              }
            </p>
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      {showCourseForm && (
        <CourseForm
          course={editingCourse || undefined}
          onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
          onCancel={() => {
            setShowCourseForm(false);
            setEditingCourse(null);
          }}
          isLoading={isLoading}
        />
      )}

      {/* File Upload Modal */}
      {showFileUpload && (
        <FileUpload
          onFileSelect={handleFileUpload}
          onCancel={() => {
            setShowFileUpload(false);
            setUploadCourseId(null);
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
