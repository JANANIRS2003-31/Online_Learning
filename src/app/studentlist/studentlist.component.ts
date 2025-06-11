import { Component, OnInit } from '@angular/core';
import { AdminProgressService } from '../admin-progress.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'studentlist',
  imports: [FormsModule,CommonModule],
  templateUrl: './studentlist.component.html',
  styleUrls: ['./studentlist.component.css']
})
export class StudentlistComponent implements OnInit {
  students: any[] = [];
  isLoading: boolean = true;
  studentProgress: any[] = [];

  constructor(private progressService: AdminProgressService) {}

  ngOnInit(): void {
    this.fetchStudents();
  }

  /** Fetch only student details */
  fetchStudents(): void {
    this.progressService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data.filter(user => user.roles === 'STUDENT'); // Ensure filtering of students
        this.isLoading = false;
        console.log("Fetched Student Data:", this.students);
      },
      error: (err) => {
        console.error("Error fetching student details:", err);
        this.isLoading = false;}
    });
  }
  
}
