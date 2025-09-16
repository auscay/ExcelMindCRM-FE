'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, Upload, Send, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Assignment, AssignmentSubmission, SubmitAssignmentData } from '@/types/assignment';

const submissionSchema = z.object({
  textSubmission: z.string().optional(),
  file: z.any().optional(),
}).refine((data) => {
  // At least one submission method must be provided
  return data.textSubmission?.trim() || data.file;
}, {
  message: "Please provide either text submission or upload a file",
  path: ["textSubmission"],
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface AssignmentSubmissionProps {
  assignment: Assignment;
  existingSubmission?: AssignmentSubmission | null;
  onSubmit: (data: SubmitAssignmentData) => Promise<void>;
  isLoading?: boolean;
}

export default function AssignmentSubmissionComponent({ 
  assignment, 
  existingSubmission,
  onSubmit, 
  isLoading = false 
}: AssignmentSubmissionProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: existingSubmission ? {
      textSubmission: existingSubmission.textSubmission || '',
    } : undefined,
  });

  // const textSubmission = watch('textSubmission');
  const isSubmitted = existingSubmission?.status === 'submitted' || existingSubmission?.status === 'graded';
  const isGraded = existingSubmission?.status === 'graded';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue('file', file);
    }
  };

  const handleFormSubmit = async (data: SubmissionFormData) => {
    setError(null);
    try {
      const submitData: SubmitAssignmentData = {
        assignmentId: assignment.id,
        textSubmission: data.textSubmission?.trim() || undefined,
        file: data.file,
      };
      await onSubmit(submitData);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to submit assignment');
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

  const isOverdue = assignment.dueAt ? new Date(assignment.dueAt) < new Date() && !isSubmitted : false;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Assignment Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{assignment.title}</h2>
            <p className="text-gray-600 mb-4">{assignment.description}</p>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOverdue ? 'bg-red-100 text-red-800' :
              isGraded ? 'bg-green-100 text-green-800' :
              isSubmitted ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {isOverdue ? 'Overdue' :
               isGraded ? 'Graded' :
               isSubmitted ? 'Submitted' :
               'Pending'}
            </div>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Due Date</p>
            <p className="font-medium">{assignment.dueAt ? formatDate(assignment.dueAt) : 'No due date'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Weight</p>
            <p className="font-medium">{assignment.weight}%</p>
          </div>
        </div>

        {/* Assignment Status Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Assignment Status: {assignment.isActive ? 'Active' : 'Inactive'}
              </p>
              <p className="text-sm text-blue-600">
                {assignment.isActive 
                  ? 'You can submit your work for this assignment.'
                  : 'This assignment is currently inactive.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Submission Status */}
      {existingSubmission && (
        <div className="mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <div className="flex items-center mb-2">
              {isGraded ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
              )}
              <h3 className="font-medium text-gray-900">
                {isGraded ? 'Submission Graded' : 'Submission Submitted'}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Submitted on: {formatDate(existingSubmission.submittedAt!)}
            </p>
            {isGraded && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Grade:</span>
                  <span className="text-lg font-bold text-green-600">
                    {existingSubmission.grade}/100
                  </span>
                </div>
                {existingSubmission.feedback && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                    <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                      {existingSubmission.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overdue Warning */}
      {isOverdue && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-sm text-red-800">
              This assignment is overdue. Late submissions may be subject to penalties.
            </p>
          </div>
        </div>
      )}

      {/* Submission Form */}
      {!isSubmitted && assignment.isActive && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Text Submission */}
          <div>
            <label htmlFor="textSubmission" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Text Submission
            </label>
            <textarea
              {...register('textSubmission')}
              rows={8}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your submission here..."
            />
            {errors.textSubmission && (
              <p className="mt-1 text-sm text-red-600">{errors.textSubmission.message}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="inline h-4 w-4 mr-1" />
              File Upload (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, TXT, JPG, PNG, GIF up to 10MB
                </p>
              </div>
            </div>
            {selectedFile && (
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <FileText className="h-4 w-4 mr-1" />
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
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
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Assignment
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Download Submitted File */}
      {existingSubmission?.fileUrl && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Submitted File:</p>
              <p className="text-sm text-gray-600">{existingSubmission.fileName}</p>
            </div>
            <a
              href={existingSubmission.fileUrl}
              download
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
