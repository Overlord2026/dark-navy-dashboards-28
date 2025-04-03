
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CourseFilter {
  category?: string;
  tag?: string;
  level?: string;
  isPaid?: boolean;
}

export interface UserToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}
