import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private baseUrl = 'http://localhost:9090/progress';

  constructor(private http: HttpClient) {}

  getProgressByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/fetchProgressByUserId/${userId}`);
  }
}
