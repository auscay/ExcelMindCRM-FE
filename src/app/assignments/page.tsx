'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import AssignmentCard from '@/components/AssignmentCard';
import AssignmentForm from '@/components/AssignmentForm';
import { Assignment, AssignmentSubmission, CreateAssignmentData } from '@/types/assignment';
import { Course } from '@/types/course';
import { assignmentService } from '@/lib/assignmentService';
import { courseService } from '@/lib/courseService';

export default function AssignmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (user.role === 'lecturer') {
        // Load lecturer's assignments and courses
        const [assignmentsData, allCoursesData] = await Promise.all([
          assignmentService.getLecturerAssignments(user.id),
          courseService.getCourses()
        ]);
        setAssignments(assignmentsData);
        
        // Filter courses to only show courses taught by this lecturer
        console.log('All courses:', allCoursesData);
        console.log('User ID:', user.id);
        console.log('User role:', user.role);
        const lecturerCourses = allCoursesData.filter(course => {
          console.log(`Course ${course.id}: lecturerId=${course.lecturerId}, matches=${course.lecturerId.toString() === user.id}`);
          return course.lecturerId.toString() === user.id;
        });
        console.log('Filtered lecturer courses:', lecturerCourses);
        
        // If no courses found, show all courses for debugging
        if (lecturerCourses.length === 0) {
          console.log('No lecturer courses found, showing all courses for debugging');
          setCourses(allCoursesData);
        } else {
          setCourses(lecturerCourses);
        }
      } else if (user.role === 'student') {
        // Load student's assignments and submissions
        const [assignmentsData, submissionsData] = await Promise.all([
          assignmentService.getStudentAssignments(user.id),
          // We'll need to get submissions for each assignment
          Promise.resolve([]) // Placeholder for now
        ]);
        setAssignments(assignmentsData);
        setSubmissions(submissionsData);
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role === 'admin') {
      router.push('/dashboard');
      return;
    }

    loadData();
  }, [isAuthenticated, user, loadData, router]);

  const handleCreateAssignment = async (data: CreateAssignmentData) => {
    try {
      await assignmentService.createAssignment(data);
      setShowForm(false);
      loadData(); // Reload assignments
    } catch (err: unknown) {
      throw new Error((err as Error).message || 'Failed to create assignment');
    }
  };

  const handleUpdateAssignment = async (data: CreateAssignmentData) => {
    if (!editingAssignment) return;
    
    try {
      await assignmentService.updateAssignment(editingAssignment.id.toString(), data);
      setEditingAssignment(null);
      loadData(); // Reload assignments
    } catch (err: unknown) {
      throw new Error((err as Error).message || 'Failed to update assignment');
    }
  };

  const handleDeleteAssignment = async (assignment: Assignment) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      await assignmentService.deleteAssignment(assignment.id.toString());
      loadData(); // Reload assignments
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to delete assignment');
    }
  };

  const handleViewAssignment = (assignment: Assignment) => {
    if (user?.role === 'student') {
      router.push(`/assignments/${assignment.id}/submit`);
    } else {
      router.push(`/assignments/${assignment.id}/submissions`);
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const getSubmissionForAssignment = (assignmentId: number) => {
    return submissions.find(sub => sub.assignmentId === assignmentId);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (user?.role === 'student') {
      const submission = getSubmissionForAssignment(assignment.id);
      const isOverdue = assignment.dueAt ? new Date(assignment.dueAt) < new Date() : false;
      const isSubmitted = submission?.status === 'submitted' || submission?.status === 'graded';
      const isGraded = submission?.status === 'graded';
      
      if (filterStatus === 'pending') return matchesSearch && !isSubmitted;
      if (filterStatus === 'submitted') return matchesSearch && isSubmitted && !isGraded;
      if (filterStatus === 'graded') return matchesSearch && isGraded;
      if (filterStatus === 'overdue') return matchesSearch && isOverdue && !isSubmitted;
    } else {
      if (filterStatus === 'active') return matchesSearch && assignment.isActive;
      if (filterStatus === 'inactive') return matchesSearch && !assignment.isActive;
    }
    
    return matchesSearch;
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.role === 'lecturer' ? 'My Assignments' : 'My Assignments'}
              </h1>
              <p className="mt-2 text-gray-600">
                {user.role === 'lecturer' 
                  ? 'Create and manage assignments for your courses'
                  : 'View and submit your assignments'
                }
              </p>
            </div>
            {user.role === 'lecturer' && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All</option>
              {user.role === 'student' ? (
                <>
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="graded">Graded</option>
                  <option value="overdue">Overdue</option>
                </>
              ) : (
                <>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Assignments Grid */}
            {filteredAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    submission={user.role === 'student' ? getSubmissionForAssignment(assignment.id) : undefined}
                    userRole={user.role === 'admin' ? 'lecturer' : user.role as 'student' | 'lecturer'}
                    onView={handleViewAssignment}
                    onEdit={user.role === 'lecturer' ? handleEditAssignment : undefined}
                    onDelete={user.role === 'lecturer' ? handleDeleteAssignment : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : user.role === 'lecturer' 
                      ? 'Get started by creating your first assignment.'
                      : 'You don\'t have any assignments yet.'
                  }
                </p>
              </div>
            )}
          </>
        )}

        {/* Assignment Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <AssignmentForm
                courses={courses}
                onSubmit={editingAssignment ? handleUpdateAssignment : handleCreateAssignment}
                onCancel={() => {
                  setShowForm(false);
                  setEditingAssignment(null);
                }}
                isLoading={loading}
                assignment={editingAssignment || undefined}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
