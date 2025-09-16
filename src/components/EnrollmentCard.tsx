'use client';

import React from 'react';
import { Enrollment } from '@/types/course';
import { User, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface EnrollmentCardProps {
  enrollment: Enrollment;
  onApprove: (enrollmentId: string) => void;
  onReject: (enrollmentId: string) => void;
  isLoading?: boolean;
}

export default function EnrollmentCard({ 
  enrollment, 
  onApprove, 
  onReject, 
  isLoading = false 
}: EnrollmentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusIcon = () => {
    switch (enrollment.status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (enrollment.status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {getStatusIcon()}
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {enrollment.course?.title}
            </h3>
            <p className="text-sm text-gray-600">
              {enrollment.course?.credits} credits
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
          {enrollment.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span>
            Student: {enrollment.student?.firstName} {enrollment.student?.lastName}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span>
            Lecturer: {enrollment.course?.lecturer?.firstName} {enrollment.course?.lecturer?.lastName}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Applied: {formatDate(enrollment.createdAt)}</span>
        </div>

        {enrollment.updatedAt !== enrollment.createdAt && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Updated: {formatDate(enrollment.updatedAt)}</span>
          </div>
        )}
      </div>

      {enrollment.course?.description && (
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {enrollment.course.description}
        </p>
      )}

      {enrollment.status === 'pending' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onApprove(enrollment.id.toString())}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </>
            )}
          </button>
          <button
            onClick={() => onReject(enrollment.id.toString())}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
