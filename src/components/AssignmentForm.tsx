'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, FileText, Upload, Save, X } from 'lucide-react';
import { CreateAssignmentData, Assignment } from '@/types/assignment';
import { Course } from '@/types/course';

const assignmentSchema = z.object({
  courseId: z.number().min(1, 'Please select a course'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  weight: z.number().min(0.1, 'Weight must be at least 0.1%').max(100, 'Weight cannot exceed 100%'),
  dueAt: z.date().optional(),
  isActive: z.boolean().optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface AssignmentFormProps {
  courses: Course[];
  onSubmit: (data: CreateAssignmentData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  assignment?: Assignment; // For editing existing assignments
}

export default function AssignmentForm({ 
  courses, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  assignment 
}: AssignmentFormProps) {
  const [error, setError] = useState<string | null>(null);

  // console.log('Assignment:', assignment);
  console.log('Courses:', courses);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: assignment ? {
      courseId: assignment.courseId,
      title: assignment.title,
      description: assignment.description || '',
      weight: assignment.weight,
      dueAt: assignment.dueAt ? new Date(assignment.dueAt) : undefined,
      isActive: assignment.isActive ?? true,
    } : undefined,
  });

  const isActive = watch('isActive');

  const handleFormSubmit = async (data: AssignmentFormData) => {
    setError(null);
    try {
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Failed to save assignment');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {assignment ? 'Edit Assignment' : 'Create New Assignment'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Course Selection */}
        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-2">
            Course
          </label>
          <select
            id="courseId"
            {...register('courseId', { valueAsNumber: true })}
            disabled={!!assignment} // Don't allow changing course when editing
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
          >
            <option value="">Select a course</option>
            <option value="1">Course 1</option>
            <option value="2">Course 2</option>
            <option value="3">Course 3</option>
            <option value="4">Course 4</option>
            <option value="5">Course 5</option>
          </select>
          {errors.courseId && (
            <p className="mt-1 text-sm text-red-600">{errors.courseId.message}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Assignment Title
          </label>
          <input
            id="title"
            {...register('title')}
            type="text"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter assignment title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe the assignment requirements..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueAt" className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Due Date (Optional)
          </label>
          <input
            id="dueAt"
            {...register('dueAt', { 
              setValueAs: (value) => value ? new Date(value) : undefined 
            })}
            type="datetime-local"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.dueAt && (
            <p className="mt-1 text-sm text-red-600">{errors.dueAt.message}</p>
          )}
        </div>

        {/* Weight and Active Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              Weight (% of final grade)
            </label>
            <input
              id="weight"
              {...register('weight', { valueAsNumber: true })}
              type="number"
              min="0.1"
              max="100"
              step="0.1"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="20"
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Status
            </label>
            <div className="flex items-center">
              <input
                id="isActive"
                {...register('isActive')}
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active (students can submit)
              </label>
            </div>
          </div>
        </div>

        {/* Assignment Info */}
        {isActive !== undefined && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  {isActive ? 'Active Assignment' : 'Inactive Assignment'}
                </p>
                <p className="text-sm text-blue-600">
                  {isActive 
                    ? 'Students can view and submit this assignment.'
                    : 'Students cannot submit this assignment.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {assignment ? 'Update Assignment' : 'Create Assignment'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
