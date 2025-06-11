import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {


  path="http://localhost:9090/auth/authenticate"
 // path_2="http://localhost:9090/auth/getUserId"
  
 
  constructor(private client:HttpClient,private router:Router) { }
 
  public LoginUser(loginUser: User) {
    localStorage.setItem("username",loginUser.username);
    console.log("ins service add");
    console.log(loginUser);
    console.log();
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
