export interface Course {
  id: string;
  title: string;
  description?: string;
  credits: number;
  lecturerId: string;
  lecturer?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  syllabus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  status: 'pending' | 'approved' | 'rejected';
  course?: Course;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
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