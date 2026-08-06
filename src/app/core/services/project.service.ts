import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Project {
  _id?: string;
  title: string;
  description: string;
  location: string;
  neededItems?: string[];
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
  createdBy?: any;
  createdAt?: string | Date;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  constructor(private readonly http: HttpClient) {}

  getProjects(params?: any): Observable<any> {
    return this.http.get<any>(this.apiUrl, { params });
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProject(project: Omit<Project, '_id'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, project);
  }

  updateProject(id: string, project: Partial<Project>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, project);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  updateProjectStatusAdmin(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/projects/${id}/status`, { status });
  }
}
