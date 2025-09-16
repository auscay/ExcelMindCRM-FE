export interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  weight: number; // Percentage weight for final grade calculation
  dueAt?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: number;
    title: string;
    code: string;
  };
  lecturer?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  textSubmission?: string;
  fileUrl?: string;
  fileName?: string;
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
  status: 'draft' | 'submitted' | 'graded';
  createdAt: string;
  updatedAt: string;
  assignment?: Assignment;
  student?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateAssignmentData {
  courseId: number;
  title: string;
  description?: string;
  weight: number;
  dueAt?: Date;
  isActive?: boolean;
}

export interface UpdateAssignmentData {
  title?: string;
  description?: string;
  weight?: number;
  dueAt?: Date;
  isActive?: boolean;
}

export interface SubmitAssignmentData {
  assignmentId: number;
  textSubmission?: string;
  file?: File;
}

export interface GradeAssignmentData {
  submissionId: number;
  grade: number;
  feedback?: string;
}

export interface CourseGrade {
  courseId: number;
  studentId: number;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  letterGrade: string;
  assignments: {
    assignmentId: number;
    title: string;
    weight: number;
    maxPoints: number;
    earnedPoints: number;
    grade: number;
  }[];
}
