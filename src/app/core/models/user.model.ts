export type UserRole = 'donor' | 'volunteer' | 'ngo' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
}
