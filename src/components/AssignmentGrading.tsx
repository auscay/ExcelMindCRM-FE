'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Clock, FileText, Download, Save, User, Calendar } from 'lucide-react';
import { AssignmentSubmission, GradeAssignmentData } from '@/types/assignment';

const gradingSchema = z.object({
  grade: z.number().min(0, 'Grade must be at least 0').max(100, 'Grade cannot exceed 100'),
  feedback: z.string().optional(),
});

type GradingFormData = z.infer<typeof gradingSchema>;

interface AssignmentGradingProps {
  submission: AssignmentSubmission;
  onGrade: (data: GradeAssignmentData) => Promise<void>;
  isLoading?: boolean;
}

export default function AssignmentGrading({ 
  submission, 
  onGrade, 
  isLoading = false 
}: AssignmentGradingProps) {
  const maxPoints = 100; // Default max points since it's not in the API
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<GradingFormData>({
    resolver: zodResolver(gradingSchema),
    defaultValues: {
      grade: submission.grade || 0,
      feedback: submission.feedback || '',
    },
  });

  const grade = watch('grade');
  const isGraded = submission.status === 'graded';

  const handleFormSubmit = async (data: GradingFormData) => {
    setError(null);
    try {
      const gradeData: GradeAssignmentData = {
        submissionId: submission.id,
        grade: data.grade,
        feedback: data.feedback?.trim() || undefined,
      };
      await onGrade(gradeData);
    } catch (err: any) {
      setError(err.message || 'Failed to grade assignment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGradeColor = (grade: number, maxPoints: number) => {
    const percentage = (grade / maxPoints) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (grade: number, maxPoints: number) => {
    const percentage = (grade / maxPoints) * 100;
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Submission Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {submission.assignment?.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <User className="h-4 w-4 mr-1" />
              {submission.student?.firstName} {submission.student?.lastName}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              Submitted: {formatDate(submission.submittedAt!)}
            </div>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isGraded ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {isGraded ? 'Graded' : 'Pending'}
            </div>
          </div>
        </div>
      </div>

      {/* Text Submission */}
      {submission.textSubmission && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Text Submission
          </h4>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <p className="text-gray-700 whitespace-pre-wrap">{submission.textSubmission}</p>
          </div>
        </div>
      )}

      {/* File Submission */}
      {submission.fileUrl && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            File Submission
          </h4>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">{submission.fileName}</p>
                <p className="text-sm text-gray-500">File uploaded</p>
              </div>
              <a
                href={submission.fileUrl}
                download
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Grading Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Grade Assignment</h4>
          
          {/* Grade Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Grade (0 - {maxPoints})
              </label>
              <input
                {...register('grade', { valueAsNumber: true })}
                type="number"
                min="0"
                max={maxPoints}
                step="0.1"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
              {errors.grade && (
                <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
              )}
            </div>
            
            {/* Grade Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade Preview
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Points:</span>
                  <span className={`font-bold ${getGradeColor(grade, maxPoints)}`}>
                    {grade}/{maxPoints}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600">Letter:</span>
                  <span className={`font-bold ${getGradeColor(grade, maxPoints)}`}>
                    {getGradeLetter(grade, maxPoints)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600">Percentage:</span>
                  <span className={`font-bold ${getGradeColor(grade, maxPoints)}`}>
                    {((grade / maxPoints) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Feedback (Optional)
            </label>
            <textarea
              {...register('feedback')}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Provide feedback to the student..."
            />
            {errors.feedback && (
              <p className="mt-1 text-sm text-red-600">{errors.feedback.message}</p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Grading...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isGraded ? 'Update Grade' : 'Submit Grade'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Current Grade Display (if already graded) */}
      {isGraded && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900">Assignment Graded</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-700">Grade:</span>
                <span className={`ml-2 font-bold ${getGradeColor(submission.grade!, maxPoints)}`}>
                  {submission.grade}/{maxPoints}
                </span>
              </div>
              <div>
                <span className="text-green-700">Letter:</span>
                <span className={`ml-2 font-bold ${getGradeColor(submission.grade!, maxPoints)}`}>
                  {getGradeLetter(submission.grade!, maxPoints)}
                </span>
              </div>
              <div>
                <span className="text-green-700">Graded:</span>
                <span className="ml-2 text-green-800">
                  {formatDate(submission.gradedAt!)}
                </span>
              </div>
            </div>
            {submission.feedback && (
              <div className="mt-3">
                <p className="text-sm font-medium text-green-700 mb-1">Feedback:</p>
                <p className="text-sm text-green-600 bg-white p-2 rounded border">
                  {submission.feedback}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
