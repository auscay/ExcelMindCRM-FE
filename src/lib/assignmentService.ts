import api from './api';
import { 
  Assignment, 
  AssignmentSubmission, 
  CreateAssignmentData, 
  UpdateAssignmentData, 
  SubmitAssignmentData, 
  GradeAssignmentData,
  CourseGrade 
} from '@/types/assignment';

export const assignmentService = {
  // Get all assignments for a course
  async getCourseAssignments(courseId: string): Promise<Assignment[]> {
    const response = await api.get(`/assignments/course/${courseId}`);
    const payload = response.data;
    
    if (payload?.data?.assignments && Array.isArray(payload.data.assignments)) {
      return payload.data.assignments as Assignment[];
    }
    if (Array.isArray(payload?.assignments)) return payload.assignments as Assignment[];
    if (Array.isArray(payload)) return payload as Assignment[];
    return [];
  },

  // Get assignments created by a lecturer
  async getLecturerAssignments(lecturerId: string): Promise<Assignment[]> {
    const response = await api.get(`/assignments/lecturer/${lecturerId}`);
    const payload = response.data;
    
    if (payload?.data?.assignments && Array.isArray(payload.data.assignments)) {
      return payload.data.assignments as Assignment[];
    }
    if (Array.isArray(payload?.assignments)) return payload.assignments as Assignment[];
    if (Array.isArray(payload)) return payload as Assignment[];
    return [];
  },

  // Get assignments for a student (across all enrolled courses)
  async getStudentAssignments(studentId: string): Promise<Assignment[]> {
    const response = await api.get(`/assignments/student/${studentId}`);
    const payload = response.data;
    
    if (payload?.data?.assignments && Array.isArray(payload.data.assignments)) {
      return payload.data.assignments as Assignment[];
    }
    if (Array.isArray(payload?.assignments)) return payload.assignments as Assignment[];
    if (Array.isArray(payload)) return payload as Assignment[];
    return [];
  },

  // Create a new assignment (lecturer only)
  async createAssignment(assignmentData: CreateAssignmentData): Promise<Assignment> {
    const response = await api.post('/assignments', assignmentData);
    const payload = response.data;
    
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
    
    if (payload?.data?.assignment) {
      return payload.data.assignment as Assignment;
    }
    return (payload?.data ?? payload) as Assignment;
  },

  // Update an assignment
  async updateAssignment(assignmentId: string, assignmentData: UpdateAssignmentData): Promise<Assignment> {
    const response = await api.put(`/assignments/${assignmentId}`, assignmentData);
    const payload = response.data;
    
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
    
    return (payload?.data ?? payload) as Assignment;
  },

  // Delete an assignment
  async deleteAssignment(assignmentId: string): Promise<void> {
    const response = await api.delete(`/assignments/${assignmentId}`);
    const payload = response.data;
    
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
  },

  // Get submissions for an assignment (lecturer only)
  async getAssignmentSubmissions(assignmentId: string): Promise<AssignmentSubmission[]> {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    const payload = response.data;
    
    if (payload?.data?.submissions && Array.isArray(payload.data.submissions)) {
      return payload.data.submissions as AssignmentSubmission[];
    }
    if (Array.isArray(payload?.submissions)) return payload.submissions as AssignmentSubmission[];
    if (Array.isArray(payload)) return payload as AssignmentSubmission[];
    return [];
  },

  // Submit an assignment (student only)
  async submitAssignment(submissionData: SubmitAssignmentData): Promise<AssignmentSubmission> {
    const formData = new FormData();
    formData.append('assignmentId', submissionData.assignmentId.toString());
    
    if (submissionData.textSubmission) {
      formData.append('textSubmission', submissionData.textSubmission);
    }
    
    if (submissionData.file) {
      formData.append('file', submissionData.file);
    }

    const response = await api.post('/assignments/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const payload = response.data;
    
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
    
    if (payload?.data?.submission) {
      return payload.data.submission as AssignmentSubmission;
    }
    return (payload?.data ?? payload) as AssignmentSubmission;
  },

  // Grade an assignment submission (lecturer only)
  async gradeSubmission(gradeData: GradeAssignmentData): Promise<AssignmentSubmission> {
    const response = await api.post('/assignments/grade', gradeData);
    const payload = response.data;
    
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
    
    if (payload?.data?.submission) {
      return payload.data.submission as AssignmentSubmission;
    }
    return (payload?.data ?? payload) as AssignmentSubmission;
  },

  // Get student's submission for a specific assignment
  async getStudentSubmission(assignmentId: string, studentId: string): Promise<AssignmentSubmission | null> {
    const response = await api.get(`/assignments/${assignmentId}/submission/${studentId}`);
    const payload = response.data;
    
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
    
    if (payload?.data?.submission) {
      return payload.data.submission as AssignmentSubmission;
    }
    return null;
  },

  // Get course grades for a student
  async getCourseGrades(courseId: string, studentId: string): Promise<CourseGrade> {
    const response = await api.get(`/assignments/course/${courseId}/grades/${studentId}`);
    const payload = response.data;
    
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
    
    if (payload?.data?.grades) {
      return payload.data.grades as CourseGrade;
    }
    return payload?.data ?? payload as CourseGrade;
  },

  // Get all grades for a student across all courses
  async getStudentGrades(studentId: string): Promise<CourseGrade[]> {
    const response = await api.get(`/assignments/student/${studentId}/grades`);
    const payload = response.data;
    
    if (payload?.data?.grades && Array.isArray(payload.data.grades)) {
      return payload.data.grades as CourseGrade[];
    }
    if (Array.isArray(payload?.grades)) return payload.grades as CourseGrade[];
    if (Array.isArray(payload)) return payload as CourseGrade[];
    return [];
  }
};
