import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../email.service';

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

  constructor(private emailService:EmailService) { }

  onSubmit() {
    const recipient = this.contactData.email;
            const msgBody = `Username: ${this.contactData.name},\n Subject: ${this.contactData.subject},\n Employee ID: ${this.contactData.message}`;
            const subject = 'Login credentials';

            this.emailService.sendEmail(recipient, msgBody, subject).subscribe({
              next: () => {
                alert('Email sent successfully!');
              },
              error: (err) => {
                console.error('Failed to send email:', err);
                alert('Failed to send email.');
              }
            });
 
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