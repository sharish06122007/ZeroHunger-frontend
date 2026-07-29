import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'zerohunger-user';
  private readonly tokenKey = 'zerohunger-token';
  private readonly currentUserSubject = new BehaviorSubject<User | null>(this.readStoredUser());

  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string, role: UserRole = 'donor'): User {
    const user: User = {
      id: `${role}-${Date.now()}`,
      name: role === 'admin' ? 'Asha Rao' : role === 'ngo' ? 'Green Hope Network' : role === 'volunteer' ? 'Milan Shah' : 'Priya Nair',
      email,
      phone: '+91 98765 43210',
      role,
      location: role === 'ngo' ? 'Mumbai' : 'Bengaluru',
    };

    this.persistSession(user, `mock-${role}-token`);
    return user;
  }

  register(user: Omit<User, 'id'>): User {
    const createdUser: User = {
      id: `user-${Date.now()}`,
      ...user,
    };

    this.persistSession(createdUser, `mock-${createdUser.role}-token`);
    return createdUser;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.tokenKey);
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserValue?.role === role;
  }

  restoreSession(): void {
    const storedUser = this.readStoredUser();
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }
  }

  private persistSession(user: User, token: string): void {
    this.currentUserSubject.next(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    localStorage.setItem(this.tokenKey, token);
  }

  private readStoredUser(): User | null {
    const storedValue = localStorage.getItem(this.storageKey);
    return storedValue ? JSON.parse(storedValue) : null;
  }
}
