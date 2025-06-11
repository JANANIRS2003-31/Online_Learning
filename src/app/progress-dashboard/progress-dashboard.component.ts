import { Component, OnInit } from '@angular/core';
import { ProgressService } from '../progress.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'progressdashboard',
  imports: [FormsModule,CommonModule],
  templateUrl: './progress-dashboard.component.html',
  styleUrls: ['./progress-dashboard.component.css']
})
export class ProgressDashboardComponent implements OnInit {
  progressData: any;
  userId:number;
  username= localStorage.getItem('username') || '';
  constructor(private progressService: ProgressService) {}

  ngOnInit(): void {
    this.fetchProgress();
  }

  fetchProgress(): void {
    const userId = localStorage.getItem('userId'); 
    if (userId) {
      this.progressService.getProgressByUserId(Number(userId)).subscribe(data => {
        this.progressData = data;
      });
    } else {
      console.error('User ID not found in local storage');
    }
  }
}
