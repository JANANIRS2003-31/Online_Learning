import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminProgressService {
  
  private baseUrl = 'http://localhost:9090/progress';

  constructor(private http: HttpClient) {}

  getAllProgress(): Observable<any> {
    return this.http.get(`${this.baseUrl}/fetchAllProgress`, { headers: { 'Accept': 'application/json' } });
  }

  getCourseEnrollmentStats(): Observable<any> {
    return this.http.get('http://localhost:9090/progress/courseEnrollments');
  }
  
  getAllEnrollments(): Observable<any> {
    return this.http.get('http://localhost:9090/enroll/fetchAll');
}

getAllStudents(): Observable<UserInfo[]> {
  return this.http.get<UserInfo[]>(`http://localhost:9090/auth/fetchAll`, { headers: { 'Accept': 'application/json' } });
}

}
export interface UserInfo {
  id: number;
  name: string;
  email: string;
  roles: string;
}

