import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private enrollUrl = 'http://localhost:9090/enroll';

  constructor(private http: HttpClient) {}

  getEnrolledCourses(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9090/enroll/fetchCoursesByUserId/${userId}`);
  }
}
