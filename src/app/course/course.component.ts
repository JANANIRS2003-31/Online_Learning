import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { LoginserviceService } from '../loginservice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonServiceService } from '../common-service.service';
import { Router } from '@angular/router';

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
  enrolledCourseIds: number[] = [];
  isEditMode: boolean = false;
  selectedCourseId: number | null = null;

  newCourse = {
    courseTitle: '',
    courseDescription: '',
    courseCategory: '',
    instructorId: '',
    prerequisites: '',
    courseDuration: '',
    imageUrl: '',
    courseContent: '',
    videoLinks: []
    

  };
  userId: number;

  constructor(
    private courseService: CourseService,
    private loginService: LoginserviceService,
    private commonService: CommonServiceService,
    private router: Router
  ) {
    this.courseService.getAllCourses().subscribe((data: any) => {
      this.courses = data;
      this.filteredCourses = data;
    });
  }
  
  navigateToQuizManagement(courseId: number): void {
    console.log("Navigating to quiz management for course ID:", courseId);
    this.router.navigate([`/coursecontent/${courseId}/quizzes`]).then(() => {
      window.location.reload(); // ✅ Forces page refresh upon navigation
    });
  }

  ngOnInit(): void {
    this.commonService.getUserId().subscribe({
      next: (userId) => {
        this.userId = userId;
        localStorage.setItem("userId", userId.toString());
  
        // ✅ Fetch enrolled courses for the user
        this.courseService.getEnrolledCoursesByUser(this.userId).subscribe({
          next: (enrolledCourses) => {
            this.enrolledCourseIds = enrolledCourses.map(course => course.courseId);
          },
          error: (err) => console.error("Error fetching enrolled courses:", err)
        });
      },
      error: (err) => console.error("Error fetching user ID:", err)
    });
  
    this.userRole = this.commonService.getUserRole()?.toUpperCase() || 'STUDENT';
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
      imageUrl: '',
      courseContent: '',
      videoLinks: ['']
    };
  }

  updateCourse(course: any): void {
  this.isEditMode = true; // ✅ Enables edit mode
  this.selectedCourseId = course.courseId;
  this.newCourse = { ...course }; // ✅ Copies existing course details to the form
  console.log("Editing Course:", this.newCourse); // ✅ Debugging output
}


  createCourse(): void {
    console.log("edit mode from create course of component", this.isEditMode)
    console.log("Payload being sent:", JSON.stringify(this.newCourse));
    console.log(this.selectedCourseId);
    console.log("Before Sending Payload:", JSON.stringify(this.newCourse));

    this.newCourse.videoLinks = Array.isArray(this.newCourse.videoLinks) 
      ? this.newCourse.videoLinks 
      : [this.newCourse.videoLinks]; 
    console.log("Updated Payload:", JSON.stringify(this.newCourse));    console.log("newCourse", this.newCourse)
    if (this.isEditMode && this.selectedCourseId !== null) {
      this.courseService.updateCourse({ ...this.newCourse, courseId: this.selectedCourseId }).subscribe(() => {
        // this.loadCourses();
        window.location.reload();

      });
    } else {
      this.courseService.createCourse(this.newCourse).subscribe(() => {
        console.log("from create course")
        // this.loadCourses();
        window.location.reload();
      });
    }
  }

  deleteCourse(courseId: number): void {
    if (this.userRole === 'ADMIN') {
      this.courseService.deleteCourse(courseId).subscribe(() => {
        window.location.reload();
      });
    }
  }


  enroll(enrollId: number): void {
    console.log("user role", this.userRole);
    console.log("enrollId........", enrollId);

    //   let userName = localStorage.getItem("username");



    // Initialize enroll2 with required values
    this.enroll2 = {
      courseId: enrollId,
      userId: this.userId
    };

    console.log("enroll from course...", this.enroll2);

    // Now call the enroll service
    this.courseService.enroll(this.enroll2).subscribe(() => {
      alert('You have Successfully enrolled in the course!');
    });
  }
    manageQuiz(courseId: number): void {
    alert(`Navigate to quiz management for course ID: ${courseId}`);
  }

  goToMyLearning(): void {
    console.log("Navigating to My Learning page...");
    this.router.navigate(['/enrollment']);
  }


}
export class enrolment2 {
  userId: number;
  courseId: number;
}
