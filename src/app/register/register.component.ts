import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../regsiter.service';

@Component({
  selector: 'registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  showPassword = false;

  @ViewChild('passwordField') passwordField!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        // Add custom password complexity validators
        Validators.minLength(8), // Minimum 8 characters
        this.passwordComplexityValidator() // Custom validator for regex rules
      ]],
      passwordRepeat: ['', Validators.required],
      roles: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  // Validator function for password mismatch
  passwordMatchValidator: ValidatorFn = (form: AbstractControl): { [key: string]: boolean } | null => {
    const password = form.get('password')?.value;
    const passwordRepeat = form.get('passwordRepeat')?.value;
    return password === passwordRepeat ? null : { mismatch: true };
  };

  // Custom password complexity validator
  passwordComplexityValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value;
      if (!value) {
        return null; // Don't validate if empty, Validators.required handles this
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value); // Common special characters

      const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

      // Return specific error keys for each failed rule
      return !passwordValid ? {
        hasUpperCase: !hasUpperCase,
        hasLowerCase: !hasLowerCase,
        hasNumber: !hasNumber,
        hasSpecialChar: !hasSpecialChar,
        passwordComplexity: true // Generic flag for overall complexity
      } : null;
    };
  }

  // Helper method to get form controls for easier template access
  get f() { return this.registrationForm.controls; }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    if (this.passwordField) {
      this.passwordField.nativeElement.type = this.showPassword ? 'text' : 'password';
    }
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      console.log('Form is invalid.');
      return;
    }
  
    console.log("Submitting registration form...", this.registrationForm.value);
  
    this.registerService.RegisterUser(this.registrationForm.value).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        alert("Registered Successfully!");
        
        // ✅ Use setTimeout to avoid blocking UI
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 500); // Short delay (0.5 sec) to smooth transition
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert("Registration failed. Please try again.");
      }
    });
  }
  onReset(): void {
    this.registrationForm.reset();
  }
}