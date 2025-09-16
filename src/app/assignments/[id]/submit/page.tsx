'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import AssignmentSubmission from '@/components/AssignmentSubmission';
import { Assignment, AssignmentSubmission as Submission, SubmitAssignmentData } from '@/types/assignment';
import { assignmentService } from '@/lib/assignmentService';

export default function AssignmentSubmitPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAssignmentData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load assignment details and check for existing submission
      const [assignmentData, submissionData] = await Promise.all([
        // We'll need to get assignment by ID - for now, we'll get all student assignments and find the one
        assignmentService.getStudentAssignments(user!.id).then(assignments => 
          assignments.find(a => a.id.toString() === assignmentId)
        ),
        assignmentService.getStudentSubmission(assignmentId, user!.id)
      ]);
      
      if (!assignmentData) {
        setError('Assignment not found');
        return;
      }
      
      setAssignment(assignmentData);
      setSubmission(submissionData);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load assignment');
    } finally {
      setLoading(false);
    }
  }, [assignmentId, user]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'student') {
      router.push('/dashboard');
      return;
    }

    loadAssignmentData();
  }, [isAuthenticated, user, assignmentId, loadAssignmentData, router]);

  const handleSubmitAssignment = async (data: SubmitAssignmentData) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const newSubmission = await assignmentService.submitAssignment(data);
      setSubmission(newSubmission);
      // Show success message or redirect
      router.push('/assignments');
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || !user || user.role !== 'student') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Assignment not found</h3>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/assignments')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Assignments
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Assignment Submission</h1>
        </div>

        {/* Assignment Submission Component */}
        <AssignmentSubmission
          assignment={assignment}
          existingSubmission={submission}
          onSubmit={handleSubmitAssignment}
          isLoading={submitting}
        />
      </div>
    </div>
  );
}
