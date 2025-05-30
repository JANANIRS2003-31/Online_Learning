import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterService } from '../regsiter.service';
 
@Component({
  selector: 'registration',
  imports: [ReactiveFormsModule, CommonModule,RouterLink,RouterOutlet,LoginComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
 
  constructor(private fb: FormBuilder,private router:Router,private registerService:RegisterService) { }
 
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
      roles: ['User', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }
 
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password').value;
    const passwordRepeat = form.get('passwordRepeat').value;
    return password === passwordRepeat ? null : { mismatch: true };
  }
 
  onSubmit(form): void {
    // if (this.registrationForm.valid) {
      // localStorage.setItem("username",form.get("username").value)
      // localStorage.setItem("password",form.get("password").value)
      // console.log('Form Submitted!', this.registrationForm.value);
      // this.router.navigate(["/login"])

      console.log("Onsubmit function is called!.....");
      console.log(this.registrationForm.value)
      this.registerService.RegisterUser(form.value).subscribe(response=>{console.log(response)})
      if (this.registrationForm.valid) {
        // Show success message
        alert("Registered Successfully!");
  
        // Redirect to login page after 3 seconds
        setTimeout(() => {
            window.location.href = "login"; // Replace with your actual login route if using Angular Routing
        }, 3000);
  }
}
  name:string;
  email:string;
  password:string;
  roles:string;
 
  onReset(): void {
    this.registrationForm.reset();
  }
}
