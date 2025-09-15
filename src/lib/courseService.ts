import api from './api';
import { Course, Enrollment } from '@/types/course';

export const courseService = {
  // Get all courses
  async getCourses(): Promise<Course[]> {
    const response = await api.get('/courses');
    const payload = response.data;
    // Support wrapped responses: { success, data: { courses, pagination } }
    if (payload?.data?.courses && Array.isArray(payload.data.courses)) {
      return payload.data.courses as Course[];
    }
    // Fallbacks for other possible shapes
    if (Array.isArray(payload?.courses)) return payload.courses as Course[];
    if (Array.isArray(payload)) return payload as Course[];
    return [];
  },

  // Get courses for a specific lecturer
  async getLecturerCourses(lecturerId: string): Promise<Course[]> {
    const response = await api.get(`/courses/lecturer/${lecturerId}`);
    const payload = response.data;
    if (payload?.data?.courses && Array.isArray(payload.data.courses)) {
      return payload.data.courses as Course[];
    }
    if (Array.isArray(payload?.courses)) return payload.courses as Course[];
    if (Array.isArray(payload)) return payload as Course[];
    return [];
  },

  // Get enrolled courses for a student
  async getStudentCourses(studentId: string): Promise<Course[]> {
    const response = await api.get(`/courses/student/${studentId}`);
    const payload = response.data;
    if (payload?.data?.courses && Array.isArray(payload.data.courses)) {
      return payload.data.courses as Course[];
    }
    if (Array.isArray(payload?.courses)) return payload.courses as Course[];
    if (Array.isArray(payload)) return payload as Course[];
    return [];
  },

  // Create a new course (lecturer only)
  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const response = await api.post('/courses', courseData);
    const payload = response.data;
    
    // Check for API error response
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
    
    // Handle nested response: { success, message, data: { course } }
    if (payload?.data?.course) {
      return payload.data.course as Course;
    }
    return (payload?.data ?? payload) as Course;
  },

  // Update a course
  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course> {
    const response = await api.put(`/courses/${courseId}`, courseData);
    const payload = response.data;
    
    // Check for API error response
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
    
    return (payload?.data ?? payload) as Course;
  },

  // Delete a course
  async deleteCourse(courseId: string): Promise<void> {
    const response = await api.delete(`/courses/${courseId}`);
    const payload = response.data;
    
    // Check for API error response
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
  },

  // Upload syllabus
  async uploadSyllabus(courseId: string, file: File): Promise<Course> {
    const formData = new FormData();
    formData.append('syllabus', file);
    
    const response = await api.post(`/courses/${courseId}/syllabus`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const payload = response.data;
    
    // Check for API error response
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
    
    return (payload?.data ?? payload) as Course;
  },

  // Enroll in a course (student)
  async enrollInCourse(courseId: string): Promise<Enrollment> {
    const response = await api.post('/enrollments/enroll', { courseId: parseInt(courseId) });
    const payload = response.data;
    
    // Check for API error response
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
    
    // Handle nested response: { success, message, data: { enrollment } }
    if (payload?.data?.enrollment) {
      return payload.data.enrollment as Enrollment;
    }
    return (payload?.data ?? payload) as Enrollment;
  },

  // Drop a course (student)
  async dropCourse(courseId: string): Promise<void> {
    const response = await api.delete(`/courses/${courseId}/enroll`);
    const payload = response.data;
    
    // Check for API error response
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
  },

  // Get all enrollments (admin)
  async getEnrollments(): Promise<Enrollment[]> {
    const response = await api.get('/enrollments');
    const payload = response.data;
    if (payload?.data?.enrollments && Array.isArray(payload.data.enrollments)) {
      return payload.data.enrollments as Enrollment[];
    }
    if (Array.isArray(payload?.enrollments)) return payload.enrollments as Enrollment[];
    if (Array.isArray(payload)) return payload as Enrollment[];
    return [];
  },

  // Approve/reject enrollment (admin)
  async updateEnrollmentStatus(enrollmentId: string, status: 'approved' | 'rejected'): Promise<Enrollment> {
    const response = await api.patch(`/enrollments/${enrollmentId}/approve`, { status });
    const payload = response.data;
    
    // Check for API error response
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
    
    return (payload?.data ?? payload) as Enrollment;
  },

  // Assign lecturer to course (admin)
  async assignLecturer(courseId: string, lecturerId: string): Promise<Course> {
    const response = await api.put(`/courses/${courseId}/assign-lecturer`, { lecturerId });
    const payload = response.data;
    
    // Check for API error response
    if (!payload.success && payload.error) {
      throw new Error(payload.error);
    }
    
    return (payload?.data ?? payload) as Course;
  },
};
