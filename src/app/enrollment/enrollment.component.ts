import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonServiceService } from '../common-service.service';

// Define an interface for the course
interface Course {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  imageUrl: string;
}

@Component({
  selector: 'enrollment',
  imports: [FormsModule, CommonModule],
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {
  enrolledCourses: Course[] = [];
  userId: number | null = null;
  isLoading: boolean = true;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.commonService.getUserId().subscribe({
      next: (userId) => {
        this.userId = userId;
        this.loadEnrolledCourses();
        localStorage.setItem("userId", userId.toString());
      },
      error: (err) => console.error("Error fetching user ID:", err)
    });
  }

  loadEnrolledCourses(): void {
    this.courseService.getEnrolledCoursesByUser(this.userId!).subscribe({
      next: (data: Course[]) => {
        this.enrolledCourses = data;
        this.isLoading = false; 
      },
      error: (err) => {
        console.error("Failed to load enrolled courses:", err);
        this.isLoading = false; 
      }
    });
  }

  navigateToCourseContent(courseId: number): void {
    console.log("Navigating to course content for course ID:", courseId);
    this.router.navigate(['/coursecontent', courseId]);
  }
}
