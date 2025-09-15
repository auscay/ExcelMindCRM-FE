export interface Course {
  id: number;
  title: string;
  description?: string;
  code: string;
  credits: number;
  maxStudents: number;
  status: 'draft' | 'published' | 'archived';
  lecturerId: number;
  lecturer?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  syllabusUrl?: string;
  syllabusFileName?: string;
  syllabus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: number;
  courseId: number;
  studentId: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  approvedBy?: number;
  course?: Course;
  student?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  approver?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  studentId: string;
  title: string;
  description?: string;
  fileUrl?: string;
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}