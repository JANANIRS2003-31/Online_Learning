import { Component, OnInit } from '@angular/core';
import { AdminProgressService } from '../admin-progress.service';
import { Chart, BarController, CategoryScale, LinearScale, BarElement,PieController, ArcElement, Tooltip, Legend} from 'chart.js';
import { CommonModule, UpperCasePipe } from '@angular/common';


@Component({
  selector: 'admin-progress-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-progress-dashboard.component.html',
  styleUrls: ['./admin-progress-dashboard.component.css']
})
export class AdminProgressDashboardComponent implements OnInit {
  progressData: any = [];
  leaderboardData: any = [];
  totalStudents: number = 0;
  totalEnrollments: number = 0;
  averageCompletion: number = 0;
  courseEnrollmentData: any = [];
username= localStorage.getItem('username') || '';

  constructor(private adminProgressService: AdminProgressService) {}

  ngOnInit(): void {
    this.fetchProgressData();
    this.fetchCourseEnrollments(); 
  }

  fetchProgressData(): void {
    this.adminProgressService.getAllProgress().subscribe(data => {
    
        console.log("Fetched Progress Data:", data); 

        let studentMap = new Map<number, { userId: number, enrolledCourses: Set<number>, totalCompletion: number, count: number }>();
        let totalCompletionSum = 0;
        let totalEnrollments = 0; 

        data.forEach(user => {
            const userId = user.userId;

            if (!studentMap.has(userId)) {
                studentMap.set(userId, { userId, enrolledCourses: new Set(), totalCompletion: 0, count: 0 });
            }

            user.courses.forEach(course => {
                const completionPercentage = course.courseCompletionPercentage ?? 0;

                let existingData = studentMap.get(userId)!;
                if (!existingData.enrolledCourses.has(course.courseId)) {
                    existingData.enrolledCourses.add(course.courseId); // ✅ Ensure unique courses per student
                    totalEnrollments += 1; // ✅ Correctly count total enrollments
                }

                existingData.totalCompletion += completionPercentage;
                existingData.count += 1;
            });
        });

        this.progressData = Array.from(studentMap.values()).map(student => ({
            userId: student.userId,
            enrolledCourses: student.enrolledCourses.size, 
            courseCompletionPercentage: student.count > 0 ? Math.round(student.totalCompletion / student.count) : 0
        }));

        console.log("Processed Unique Progress Data:", this.progressData);

        this.leaderboardData = [...this.progressData].sort((a, b) => b.courseCompletionPercentage - a.courseCompletionPercentage);

        this.totalStudents = this.progressData.length;
        this.totalEnrollments = totalEnrollments; 

        // ✅ Fix: Calculate total completion sum correctly
        totalCompletionSum = this.progressData.reduce((sum, student) => sum + student.courseCompletionPercentage, 0);

        // ✅ Corrected average completion calculation
        this.averageCompletion = this.totalStudents > 0 && totalCompletionSum > 0
            ? Math.round(totalCompletionSum / this.totalStudents) // ✅ Correct denominator
            : 0;

        console.log("Final Total Enrollments:", this.totalEnrollments);
        console.log("Final Total Completion Sum:", totalCompletionSum);
        console.log("Final Average Completion %:", this.averageCompletion);

        this.generateCharts();
    });
}


  calculateAverageCompletion(courses: any[]): number {
    if (!courses.length) return 0;
    const totalCompletion = courses.reduce((sum, course) => sum + course.courseCompletionPercentage, 0);
    return Math.round(totalCompletion / courses.length);
  }

 
  generateCharts(): void {
    // Register required Chart.js components
    Chart.register(BarController, CategoryScale, LinearScale, BarElement);
    Chart.register(PieController, CategoryScale, ArcElement, Tooltip, Legend);

  
    const studentIds = this.progressData.map(s => `ID ${s.userId}`);
    const completionRates = this.progressData.map(s => s.courseCompletionPercentage);
    const totalEnrollments = this.progressData.map(s => s.enrolledCourses);
  
    new Chart(document.getElementById('barChart') as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels: studentIds,
        datasets: [{
          label: 'Completion %',
          data: completionRates,
          backgroundColor: 'rgba(75, 192, 192, 0.8)', // Slightly more opaque
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            },
            animation: { // Add animation to bar chart
                duration: 1000, // Duration in milliseconds
                easing: 'easeInOutQuad' // Easing function
            },
            scales: { // Enhance scales for cleaner look
                x: {
                    grid: { display: false } // Remove vertical grid lines
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' } // Lighter horizontal grid lines
                }
            }
        }
    });
  
    new Chart(document.getElementById('pieChart') as HTMLCanvasElement, {
      type: 'pie',
      data: {
        labels: studentIds,
        datasets: [{
            label: 'Courses Enrolled',
            data: totalEnrollments,
            backgroundColor: [ // More professional color palette for pie chart
                '#42A5F5', // Light Blue
                '#FF6384', // Reddish Pink
                '#66BB6A', // Green
                '#FFCE56', // Yellow
                '#AB47BC', // Purple
                '#EF5350', // Red
                '#FFA726', // Orange
                '#26C6DA', // Cyan
                '#78909C', // Blue Grey
                '#D4E157'  // Lime Green
            ],
            hoverOffset: 10 // Slight hover effect for pie slices
        }]
      },
      options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { // Enhance tooltip for better readability
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { size: 16 }, // Set font size for title
                    bodyFont: { size: 14 } // Set font size for body
                }
            },
            animation: { // Add animation to pie chart
                animateRotate: true,
                animateScale: true,
                duration: 1200 // Slightly longer animation for pie
            }
        }
    });
  }

  fetchCourseEnrollments(): void {
    this.adminProgressService.getCourseEnrollmentStats().subscribe({
        next: (data) => {
            console.log("Course Enrollment Data:", data); 
            this.courseEnrollmentData = Object.entries(data).map(([course, count]) => ({
                courseTitle: course,
                enrollmentCount: count
            }));
            this.generateCourseChart();
        },
        error: (err) => console.error("Error fetching course enrollments:", err) 
    });
}


  generateCourseChart(): void {
    Chart.register(BarController, CategoryScale, LinearScale, BarElement);
    
    const courseNames = this.courseEnrollmentData.map(c => c.courseTitle);
    const enrollments = this.courseEnrollmentData.map(c => c.enrollmentCount);
  
    new Chart(document.getElementById('courseChart') as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels: courseNames,
        datasets: [{
          label: 'Course Enrollments',
          data: enrollments,
          backgroundColor: 'rgba(255, 99, 132, 0.8)', // Slightly more opaque
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            },
            animation: { // Add animation to course chart
                duration: 1000, // Duration in milliseconds
                easing: 'easeInOutQuad' // Easing function
            },
            scales: { // Enhance scales for cleaner look
                x: {
                    grid: { display: false } // Remove vertical grid lines
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' } // Lighter horizontal grid lines
                }
            }
        }
    });
  }
  
  getBadgeClass(rank: number): string { return rank === 0 ? 'bg-gold' : rank === 1 ? 'bg-silver' : rank === 2 ? 'bg-bronze' : 'bg-normal'; } 
}