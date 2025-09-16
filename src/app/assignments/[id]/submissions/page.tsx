'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Users, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import AssignmentGrading from '@/components/AssignmentGrading';
import { Assignment, AssignmentSubmission } from '@/types/assignment';
import { assignmentService } from '@/lib/assignmentService';

export default function AssignmentSubmissionsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissionsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load assignment submissions
      const submissionsData = await assignmentService.getAssignmentSubmissions(assignmentId);
      setSubmissions(submissionsData);
      
      // Get assignment details from first submission or create a mock assignment
      if (submissionsData.length > 0 && submissionsData[0].assignment) {
        setAssignment(submissionsData[0].assignment);
      } else {
        // If no submissions, we might need to get assignment details separately
        // For now, we'll create a placeholder
        setAssignment({
          id: parseInt(assignmentId),
          courseId: 0,
          title: 'Assignment',
          weight: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Assignment);
      }
    } catch (err: unknown) {
      setError((err as Error) .message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'lecturer') {
      router.push('/dashboard');
      return;
    }

    loadSubmissionsData();
  }, [isAuthenticated, user, assignmentId, loadSubmissionsData, router]);

  const handleGradeSubmission = async (data: { submissionId: number; grade: number; feedback?: string }) => {
    setGrading(true);
    setError(null);
    
    try {
      await assignmentService.gradeSubmission(data);
      // Reload submissions to get updated data
      await loadSubmissionsData();
      setSelectedSubmission(null);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  const getSubmissionStatus = (submission: AssignmentSubmission) => {
    if (submission.status === 'graded') return { text: 'Graded', color: 'text-green-600', icon: CheckCircle };
    if (submission.status === 'submitted') return { text: 'Submitted', color: 'text-blue-600', icon: Clock };
    return { text: 'Draft', color: 'text-yellow-600', icon: AlertCircle };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated || !user || user.role !== 'lecturer') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading submissions</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => router.push('/assignments')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/assignments')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Assignments
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {assignment?.title || 'Assignment'} Submissions
              </h1>
              <p className="mt-2 text-gray-600">
                Grade and provide feedback for student submissions
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Submissions</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {submissions.length > 0 ? (
                  submissions.map((submission) => {
                    const status = getSubmissionStatus(submission);
                    const StatusIcon = status.icon;
                    
                    return (
                      <button
                        key={submission.id}
                        onClick={() => setSelectedSubmission(submission)}
                        className={`w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                          selectedSubmission?.id === submission.id ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {submission.student?.firstName} {submission.student?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {submission.student?.email}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(submission.submittedAt || submission.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <StatusIcon className={`h-4 w-4 ${status.color} mr-1`} />
                            <span className={`text-xs font-medium ${status.color}`}>
                              {status.text}
                            </span>
                          </div>
                        </div>
                        {submission.grade !== undefined && (
                          <div className="mt-2 text-right">
                            <span className="text-sm font-bold text-green-600">
                              {submission.grade}/100
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-6 py-8 text-center">
                    <Users className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No submissions yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Grading Interface */}
          <div className="lg:col-span-2">
            {selectedSubmission ? (
              <AssignmentGrading
                submission={selectedSubmission}
                onGrade={handleGradeSubmission}
                isLoading={grading}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Select a submission</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a submission from the list to start grading
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
