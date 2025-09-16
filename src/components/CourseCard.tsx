'use client';

import React from 'react';
import { Course } from '@/types/course';
import { BookOpen, User, Calendar, FileText } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  userRole: 'student' | 'lecturer' | 'admin';
  onEnroll?: (courseId: number) => void;
  onDrop?: (courseId: number) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (courseId: number) => void;
  onUploadSyllabus?: (courseId: number) => void;
  enrollmentStatus?: 'pending' | 'approved' | 'rejected' | null;
}

export default function CourseCard({
  course,
  userRole,
  onEnroll,
  onDrop,
  onEdit,
  onDelete,
  onUploadSyllabus,
  enrollmentStatus
}: CourseCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = () => {
    if (!enrollmentStatus) return null;
    
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[enrollmentStatus]}`}>
        {enrollmentStatus}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <BookOpen className="h-6 w-6 text-indigo-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.credits} credits</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {course.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
      )}

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <User className="h-4 w-4 mr-2" />
        <span>
          {course.lecturer?.firstName} {course.lecturer?.lastName}
        </span>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Calendar className="h-4 w-4 mr-2" />
        <span>Created: {formatDate(course.createdAt)}</span>
      </div>

      {course.syllabus && (
        <div className="flex items-center text-sm text-indigo-600 mb-4">
          <FileText className="h-4 w-4 mr-2" />
          <span>Syllabus available</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {userRole === 'student' && (
          <>
            {!enrollmentStatus && (
              <button
                onClick={() => onEnroll?.(course.id)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
              >
                Enroll
              </button>
            )}
            {enrollmentStatus === 'approved' && (
              <button
                onClick={() => onDrop?.(course.id)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                Drop Course
              </button>
            )}
          </>
        )}

        {userRole === 'lecturer' && (
          <>
            <button
              onClick={() => onEdit?.(course)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onUploadSyllabus?.(course.id)}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              {course.syllabus ? 'Update Syllabus' : 'Upload Syllabus'}
            </button>
            <button
              onClick={() => onDelete?.(course.id)}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </>
        )}

        {userRole === 'admin' && (
          <button
            onClick={() => onEdit?.(course)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Manage
          </button>
        )}
      </div>
    </div>
  );
}
