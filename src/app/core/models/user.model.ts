// core/models/user.model.ts
export type UserRole = 'restaurant' | 'volunteer' | 'ngo' | 'donor' | 'receiver' | 'admin';

export interface User {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  organizationName?: string;
  address?: string;
  city?: string;
  profileImage?: string;
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  profileCompleted?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors: Array<{ field?: string; message: string }>;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
