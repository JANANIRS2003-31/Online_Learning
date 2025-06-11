import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-contact-us', 
  templateUrl: './contact.component.html', 
  styleUrls: ['./contact.component.css'], 
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ContactUsComponent { 
  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor() { }

  onSubmit() {
    console.log('Contact form submitted:', this.contactData);
    alert('Thank you for your message! We will get back to you soon.');
    this.resetForm();
  }

  resetForm() {
    this.contactData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}