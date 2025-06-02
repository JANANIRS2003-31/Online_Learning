import { Component, OnInit } from '@angular/core';
import { CourseService, enrolment } from '../course.service';
import { LoginserviceService } from '../loginservice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courses: any[] = [];
  enroll2: enrolment2;
  filteredCourses: any[] = [];
  userRole: string = '';
  searchTerm: string = '';


  isEditMode: boolean = false;
  selectedCourseId: number | null = null;

  newCourse = {
    courseTitle: '',
    courseDescription: '',
    courseCategory: '',
    instructorId: '',
    prerequisites: '',
    courseDuration: '',
    imageUrl: ''
  };

  constructor(
    private courseService: CourseService,
    private loginService: LoginserviceService,
    private commonService: CommonServiceService
  ) {

  }

  ngOnInit(): void {
    this.userRole = this.commonService.getUserRole()?.toUpperCase() || 'STUDENT';
    this.loadCourses();

  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe((data: any) => {
      this.courses = data;
      this.filteredCourses = data;
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(course =>
      course.courseTitle.toLowerCase().includes(term)
    );
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.selectedCourseId = null;
    this.newCourse = {
      courseTitle: '',
      courseDescription: '',
      courseCategory: '',
      instructorId: '',
      prerequisites: '',
      courseDuration: '',
      imageUrl: ''
    };
  }

  updateCourse(course: any): void {
    this.isEditMode = true;
    this.selectedCourseId = course.courseId;
    this.newCourse = { ...course };
  }

  createCourse(): void {
    console.log("edit mode from create course of component", this.isEditMode)
    console.log("newCourse", this.newCourse)
    console.log(this.selectedCourseId);
    if (this.isEditMode && this.selectedCourseId !== null) {
      this.courseService.updateCourse({ ...this.newCourse, courseId: this.selectedCourseId }).subscribe(() => {
        this.loadCourses();

      });
    } else {
      this.courseService.createCourse(this.newCourse).subscribe(() => {
        console.log("from create course")
        this.loadCourses();
      });
    }
  }

  deleteCourse(courseId: number): void {
    if (this.userRole === 'ADMIN') {
      this.courseService.deleteCourse(courseId).subscribe(() => {
        this.loadCourses();
      });
    }
  }


  enroll(enrollId: number): void {
      console.log("user role", this.userRole);
      console.log("enrollId........", enrollId);
    
      let userName = localStorage.getItem("username");
    
      this.commonService.getUserId(userName).subscribe({
        next: (response) => {
          console.log("User ID response:", response);
    
          // Initialize enroll2 with required values
          this.enroll2 = {
            courseId: enrollId,
            userId: response
          };
    
          console.log("enroll from course...", this.enroll2);
    
          // Now call the enroll service
          this.courseService.enroll(this.enroll2).subscribe(() => {
            alert('You have Successfully enrolled in the course!');
          });
        },
        error: (err) => {
          console.error("Failed to get user ID", err);
        }
      });
    }
    

  manageQuiz(courseId: number): void {
    alert(`Navigate to quiz management for course ID: ${courseId}`);
  }
}

export class enrolment2{
  userId:number;
  courseId:number;
}