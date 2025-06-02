import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '../common-service.service';
import { LoginserviceService } from '../loginservice.service';
import { jwtDecode } from 'jwt-decode';
 
@Component({
  selector: 'login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
 
export class LoginComponent {
  constructor(private router:Router,private commonService:CommonServiceService,private myservice:LoginserviceService) { }
  // validate(form:NgForm){
  //   console.log("logged in.......")
  //   console.log(form)
  //   console.log(form.value)
  //   var uname= localStorage.getItem("username")
  //   var psw=localStorage.getItem("password")
  //   if(uname==form.value.username && psw==form.value.password){
  //     this.commonService.login()
  //     console.log("logged in")
  //     this.router.navigate([""])
  //   }
  // }
  token:string;
  authLogin(form:NgForm):any{
    console.log("logged in............")
    console.log(form.value)
    console.log("username",form.value.username);
    localStorage.setItem("username",form.value.username);
    // this.myservice.LoginUser(form.value).subscribe(response=>{console.log("JWT"+response)});

    this.myservice.LoginUser(form.value).subscribe({
      next: (response) => {
        localStorage.setItem("token", response);
        console.log("Login successful:", response);
        const token = response;
        const decoded = jwtDecode<JwtPayload>(token);
        const role: string = decoded.roles ?? 'No role found';
        console.log(role);
        // if(role === 'ADMIN'){
        //   this.router.navigate(["/cust-home"]);
        // }
        // else{
        //   this.router.navigate(["/agent-home"]);
        // }
       
       
 
      },
      error: (err) => {
        if (err.status === 403) {
          alert("Invalid credentials. Please try again.");
        } else {
          alert("Something went wrong. Please try later.");
        }
      }
    });
  }
 
 
}
interface JwtPayload {
  roles?: string;
}