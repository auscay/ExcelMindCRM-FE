'use client';

import React from 'react';
import { Calendar, FileText, Upload, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { Assignment, AssignmentSubmission } from '@/types/assignment';

interface AssignmentCardProps {
  assignment: Assignment;
  submission?: AssignmentSubmission | null;
  userRole: 'student' | 'lecturer';
  onView?: (assignment: Assignment) => void;
  onEdit?: (assignment: Assignment) => void;
  onDelete?: (assignment: Assignment) => void;
  onGrade?: (assignment: Assignment) => void;
}

export default function AssignmentCard({ 
  assignment, 
  submission,
  userRole,
  onView,
  onEdit,
  onDelete,
  onGrade
}: AssignmentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = assignment.dueAt ? new Date(assignment.dueAt) < new Date() : false;
  const isSubmitted = submission?.status === 'submitted' || submission?.status === 'graded';
  const isGraded = submission?.status === 'graded';

  const getStatusColor = () => {
    if (userRole === 'student') {
      if (isGraded) return 'bg-green-100 text-green-800';
      if (isSubmitted) return 'bg-blue-100 text-blue-800';
      if (isOverdue) return 'bg-red-100 text-red-800';
      return 'bg-yellow-100 text-yellow-800';
    } else {
      if (assignment.isActive) return 'bg-green-100 text-green-800';
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    if (userRole === 'student') {
      if (isGraded) return 'Graded';
      if (isSubmitted) return 'Submitted';
      if (isOverdue) return 'Overdue';
      return 'Pending';
    } else {
      return assignment.isActive ? 'Active' : 'Inactive';
    }
  };

  const getStatusIcon = () => {
    if (userRole === 'student') {
      if (isGraded) return <CheckCircle className="h-4 w-4" />;
      if (isSubmitted) return <CheckCircle className="h-4 w-4" />;
      if (isOverdue) return <AlertCircle className="h-4 w-4" />;
      return <Clock className="h-4 w-4" />;
    } else {
      return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {assignment.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {assignment.course?.code} - {assignment.course?.title}
          </p>
          <p className="text-sm text-gray-500 line-clamp-2">
            {assignment.description}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="ml-1">{getStatusText()}</span>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <div>
            <p className="font-medium">Due Date</p>
            <p className="text-xs">{assignment.dueAt ? formatDate(assignment.dueAt) : 'No due date'}</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <div>
            <p className="font-medium">Weight</p>
            <p className="text-xs">{assignment.weight}%</p>
          </div>
        </div>
      </div>

      {/* Student Submission Info */}
      {userRole === 'student' && submission && (
        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-600">Submitted:</span>
              <span className="ml-2 font-medium">
                {formatDateTime(submission.submittedAt!)}
              </span>
            </div>
            {isGraded && (
              <div className="text-right">
                <span className="text-gray-600">Grade:</span>
                <span className="ml-2 font-bold text-green-600">
                  {submission.grade}/100
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lecturer Info */}
      {userRole === 'lecturer' && (
        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-600">Created:</span>
              <span className="ml-2 font-medium">
                {formatDateTime(assignment.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <span className="ml-2 font-medium">
                {formatDateTime(assignment.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        {userRole === 'student' && (
          <button
            onClick={() => onView?.(assignment)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitted ? 'View Submission' : 'Submit Assignment'}
          </button>
        )}
        
        {userRole === 'lecturer' && (
          <>
            <button
              onClick={() => onView?.(assignment)}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              View Submissions
            </button>
            <button
              onClick={() => onEdit?.(assignment)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(assignment)}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
