import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = 'http://localhost:9090/quiz';

  constructor(private http: HttpClient) {}
  getQuizzesByCourseId(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9090/quiz/getQuizByCourseId/${courseId}`);
  }
  getQuizById(quizId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/quiz/getById/${quizId}`);
  }

  createQuiz(quiz: any) {
    return this.http.post(`${this.baseUrl}/create`, quiz, { responseType: 'text' });
  }
 
  updateQuiz(quiz: any): Observable<any> {
    return this.http.put(`http://localhost:9090/quiz/update`, quiz);
  }

  deleteQuiz(quizId: number){
    return this.http.delete(`http://localhost:9090/quiz/delete/${quizId}`,{responseType: 'text'});
  }

  submitQuiz(quizData: any): Observable<any> {
    return this.http.post(`http://localhost:9090/quiz/submit`, quizData);
  }

  getCourseDetails(courseId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/course/fetchById/${courseId}`, {
      headers: { 'Accept': 'application/json' } 
    });
  }

  getQuizSubmissionByUserIdAndQuizId(userId: number, quizId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/quiz/getSubmissionByUserIdAndQuizId/${userId}/${quizId}`);
  }
  
  
}
