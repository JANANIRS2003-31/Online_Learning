import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '../common-service.service';
import { LoginserviceService } from '../loginservice.service';
 
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
    this.myservice.LoginUser(form.value).subscribe(response=>{console.log("JWT"+response)});
  }
 
 
}