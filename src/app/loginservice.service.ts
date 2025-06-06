import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {
  // getLoginStatus(): boolean {
  //   throw new Error('Method not implemented.');
  // }
  // logout() {
  //   throw new Error('Method not implemented.');
  // }

  path="http://localhost:9090/auth/authenticate"
  
 
  constructor(private client:HttpClient,private router:Router) { }
 
  public LoginUser(loginUser: User) {
    console.log("ins service add");
    console.log(loginUser);
    console.log();
    this.router.navigate(["/body"])
    return this.client.post(this.path, loginUser,{responseType:'text'}).pipe(
      tap(()=>{
        this.isLoggedIn=true
      }));
}
isLoggedIn:boolean=false

logout():boolean{
  this.isLoggedIn=false
  localStorage.clear()
  this.router.navigate(["/login"])
  return this.isLoggedIn
}
getLoginStatus(): boolean{
  return this.isLoggedIn;
}
}
export class User{
  username:string;
  password:string
}
