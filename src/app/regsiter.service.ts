import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  path="http://localhost:9090/auth/new"
  constructor(private client:HttpClient) { }

  
  RegisterUser(registerUser:User){
    console.log("Regiter service started");
    console.log(registerUser);
    return this.client.post(this.path, registerUser,{responseType:'text'});
  }
}
export class User{
  name:string;
  email:string;
  password:string;
  roles:string;
}