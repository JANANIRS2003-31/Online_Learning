import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '../common-service.service';
import { LoginserviceService } from '../loginservice.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'login',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
 
export class LoginComponent {
  constructor(private router:Router,private commonService:CommonServiceService,private myservice:LoginserviceService) { }

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
        this.router.navigate(["/course"])
       
 
      },
      error: (err) => {
        if (err.status === 403) {
          alert("Invalid credentials. Please try again.");
        } else {
          alert("Provide correct credentials");
        }
      }
    });
  }
 
 
}
interface JwtPayload {
  roles?: string;
  userId?: number;
}