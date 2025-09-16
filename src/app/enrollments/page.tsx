'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { courseService } from '@/lib/courseService';
import { Enrollment } from '@/types/course';
import EnrollmentCard from '@/components/EnrollmentCard';
import { Filter, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function EnrollmentsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (isAuthenticated && user?.role === 'admin') {
      loadEnrollments();
    }
  }, [loading, isAuthenticated, user, router]);

  useEffect(() => {
    let filtered = enrollments;
    
    if (statusFilter !== 'all') {
      filtered = enrollments.filter(enrollment => enrollment.status === statusFilter);
    }
    
    setFilteredEnrollments(filtered);
  }, [enrollments, statusFilter]);

  const loadEnrollments = async () => {
    setIsLoading(true);
    try {
      const enrollmentsData = await courseService.getEnrollments();
      setEnrollments(enrollmentsData);
    } catch (err: unknown) {
      setError('Failed to load enrollments. Please try again.');
      console.error('Error loading enrollments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveEnrollment = async (enrollmentId: string) => {
    try {
      await courseService.updateEnrollmentStatus(enrollmentId, 'approved');
      loadEnrollments();
    } catch (err: unknown) {
      setError('Failed to approve enrollment. Please try again.');
      console.error('Error approving enrollment:', err);
    }
  };

  const handleRejectEnrollment = async (enrollmentId: string) => {
    try {
      await courseService.updateEnrollmentStatus(enrollmentId, 'rejected');
      loadEnrollments();
    } catch (err: unknown) {
      setError('Failed to reject enrollment. Please try again.');
      console.error('Error rejecting enrollment:', err);
    }
  };

  const getStatusCounts = () => {
    return {
      total: enrollments.length,
      pending: enrollments.filter(e => e.status === 'pending').length,
      approved: enrollments.filter(e => e.status === 'approved').length,
      rejected: enrollments.filter(e => e.status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">Enrollment Management</h1>
            <p className="text-gray-600">Review and manage course enrollment requests</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.approved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All ({statusCounts.total})</option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="approved">Approved ({statusCounts.approved})</option>
              <option value="rejected">Rejected ({statusCounts.rejected})</option>
            </select>
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

        {/* Enrollments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <EnrollmentCard
              key={enrollment.id}
              enrollment={enrollment}
              onApprove={handleApproveEnrollment}
              onReject={handleRejectEnrollment}
              isLoading={isLoading}
            />
          ))}
        </div>

        {filteredEnrollments.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter === 'all' ? 'No enrollments found' : `No ${statusFilter} enrollments`}
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'There are no course enrollments at the moment'
                : `There are no ${statusFilter} enrollments at the moment`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
