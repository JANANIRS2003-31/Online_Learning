import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CommonServiceService } from '../common-service.service';

interface Course {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  courseContent: string;
  videoLinks: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-coursecontent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coursecontent.component.html',
  styleUrls: ['./coursecontent.component.css']
})
export class CourseContentComponent implements OnInit {
  courseId!: number;
  courseDetails: Course | null = null;
  sanitizedVideoLinks: SafeResourceUrl[] = [];
  userRole: string = '';

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private commonService: CommonServiceService // Added commonService
  ) {}

  /** Fetch course details including video links */
  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.userRole = this.commonService.getUserRole()?.toUpperCase() || 'STUDENT';
    
    console.log('Course ID from route:', this.courseId);
    console.log('User Role:', this.userRole);

    this.fetchCourseDetails();
  }

  fetchCourseDetails(): void {
    console.log('Fetching course details for ID:', this.courseId);
    this.courseService.getCourseDetails(this.courseId).subscribe({
      next: (data: Course) => {
        this.courseDetails = data;
        this.sanitizeVideoLinks();
      },
      error: (err) => {
        console.error('Error fetching course details:', err);
      }
    });
  }

  /** Navigates students to the quiz list page */
  navigateToQuiz(courseId: number): void {
  this.router.navigate([`/coursecontent/${courseId}/quizzes`]);
}

  sanitizeVideoLinks(): void {
    if (this.courseDetails?.videoLinks) {
      this.sanitizedVideoLinks = this.courseDetails.videoLinks.map(link => {
        let embedUrl = link;
        if (link.includes("youtu.be/")) {
          embedUrl = link.replace("youtu.be/", "www.youtube.com/embed/");
        } else if (link.includes("watch?v=")) {
          embedUrl = link.replace("watch?v=", "embed/");
        }
        console.log(embedUrl);
        return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      });
    }
  }
}
