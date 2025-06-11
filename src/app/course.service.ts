import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:9090/course';

  constructor(private http: HttpClient) {}

  
  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:9090/course/fetchAll',);
  }

  enroll(enroll2:enrolment) {
    console.log("enroll from course servie",enroll2)
    return this.http.post(`http://localhost:9090/enroll/save`,enroll2, {responseType:'text'});
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`http://localhost:9090/course/delete/${courseId}`,{ responseType:'text'});
  }

  createCourse(course: any): Observable<any> {
    console.log("from service")
    return this.http.post(`http://localhost:9090/course/create`, course, { responseType: 'text' });
  }
  
  updateCourse(course: any): Observable<any> {
    return this.http.put('http://localhost:9090/course/update', course);
  }

  getEnrolledCoursesByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9090/enroll/fetchCoursesByUserId/${userId}`);
  }
  getCourseDetails(courseId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/course/fetchById/${courseId}`);
  }
}

export class enrolment{
  userId:number;
  courseId:number;
}