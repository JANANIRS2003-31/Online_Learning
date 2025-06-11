import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { CourseService } from '../course.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'body',
  standalone: true,
  imports: [FooterComponent,FormsModule,CommonModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent implements OnInit {
  courses: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe((data) => {
      this.courses = data;
      console.log('Courses fetched:', this.courses);
    });
  }
}
export interface Course {
  courseId: number;
  courseTitle: string;
  imageUrl: string;
}

