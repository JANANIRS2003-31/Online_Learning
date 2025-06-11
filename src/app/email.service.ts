import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
  export class EmailService {
    private emailApiUrl = 'http://localhost:8086/notification/sendMail';
   
    constructor(private http: HttpClient) {}
   
    sendEmail(recipient: string, msgBody: string, subject: string): Observable<any> {
      const emailPayload = {
        recipient,
        msgBody,
        subject
      };
   
      console.log('Email Payload:', emailPayload); 
   
      return this.http.post(this.emailApiUrl, emailPayload, {
        headers: { 'Content-Type': 'application/json' }, 
        responseType: 'text' 
      });
    }
  }