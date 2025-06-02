import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
 
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
    return payload?.roles || null;
  }
  getUserId(name:String):Observable<any>{
    // console.log(`http://localhost:9090/auth//getUserId/${name}`)
    return this.http.get(`http://localhost:9090/auth//getUserId/${name}`); 
  }
}