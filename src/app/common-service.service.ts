import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  userRole: string = '';
 
  constructor(private http:HttpClient) { }
  isLoggedIn:boolean=false
  login(){
    this.isLoggedIn=true
  }
  logout(){
    this.isLoggedIn=true
  }

  getLoginStatus(): boolean{
    return this.isLoggedIn;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
 

  getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;
 
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
 
  getUserRole(): string | null {
    const payload = this.getTokenPayload();
    localStorage.setItem("userRole", payload?.roles || '');
    this.userRole = payload?.roles || '';
    return payload?.roles || null;
  }
  getUserId(): Observable<number> {
    const username:string = localStorage.getItem("username");
    if (!username) {
      console.error("Username not found in localStorage!");
      return new Observable<number>((observer) => observer.error("No username found"));
    }
  
    return this.http.get<number>(`http://localhost:9090/auth/getUserId/${username}`);
  }

}