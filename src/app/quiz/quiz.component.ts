import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../quiz.service';
import { CourseService } from '../course.service';
import { CommonServiceService } from '../common-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Quiz {
  quizId: number;
  title: string;
  totalMarks: number;
  questions: { [key: number]: string }; 
  options?: { [key: number]: string[] };
  correctAnswers: { [key: number]: string }; 
  courseId: number;
  totalQuestions: number;
}

@Component({
  selector: 'quizzes',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  courseId!: number;
  quizzes: Quiz[] = [];
  userRole: string = '';
  isSubmitting: boolean = false; 
  isEditQuizMode: boolean = false;
  isCreatingQuiz: boolean = false; 
  selectedQuizId: number | null = null;
  courseDetails: any = {};
  quizTimer: number = 600; 
  paginatedQuizzes: Quiz[] = [];
  currentPage: number = 1;
  quizzesPerPage: number = 5;

  newQuiz = {
    quizId: 0,
    title: '',
    totalMarks: 0,
    questions: {} as { [key: number]: string },
    options: {} as { [key: number]: string[] }, // Options stored here
    correctAnswers: {} as { [key: number]: string },
    courseId: this.courseId
  };

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private courseService: CourseService,
    private commonService: CommonServiceService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.courseId || this.courseId === 0) {
      console.error("Invalid courseId detected:", this.courseId);
      return;
    }

    this.userRole = this.commonService.getUserRole()?.toUpperCase() || 'STUDENT';
    console.log("Fetched User Role:", this.userRole);

    this.cdRef.detectChanges(); 

    this.loadCourseDetails();
    this.loadQuizzes();
  }

  /** Fetch course details */
  loadCourseDetails(): void {
    this.courseService.getCourseDetails(this.courseId).subscribe({
      next: (data) => {
        this.courseDetails = data;
      },
      error: (err) => console.error("Error fetching course details:", err)
    });
  }

  /** Fetch quizzes for the course */
  loadQuizzes(): void {
    this.quizService.getQuizzesByCourseId(this.courseId).subscribe({
      next: (data: Quiz[]) => {
        console.log("Fetched Quizzes:", data);
  
        this.quizzes = data.map(quiz => ({
          quizId: quiz.quizId,
          title: quiz.title,
          totalMarks: quiz.totalMarks,
          questions: Object.fromEntries(Object.entries(quiz.questions || {})),
          options: quiz.options && Object.keys(quiz.options).length ? Object.fromEntries(Object.entries(quiz.options)) : {}, // Ensure options exist
          correctAnswers: Object.fromEntries(Object.entries(quiz.correctAnswers || {})),
          courseId: quiz.courseId,
          totalQuestions: Object.keys(quiz.questions || {}).length
        }));
  
        this.paginateQuizzes();
      },
      error: (err) => console.error("Error fetching quizzes:", err)
    });
  }
  
  
  
  /** Navigates to quiz attempt page for students */
  startQuiz(quizId: number): void {
    console.log("Navigating to quiz-attempt for Quiz ID:", quizId);
    this.router.navigate(['/quiz-attempt', quizId]); 
  }

  updateQuiz(quiz: Quiz): void {
    this.isEditQuizMode = true;
    this.isCreatingQuiz = true;
    this.selectedQuizId = quiz.quizId;

    this.newQuiz = {
      quizId: quiz.quizId,
      title: quiz.title,
      totalMarks: quiz.totalMarks,
      questions: { ...quiz.questions },
      options: quiz.options && Object.keys(quiz.options).length ? { ...quiz.options } : {}, // Ensure options exist
      correctAnswers: { ...quiz.correctAnswers },
      courseId: quiz.courseId
    };
  }
  
  
  /** Creates a new quiz */
  showQuizCreationForm(): void {
    console.log("Create Quiz button clicked!");
    this.isEditQuizMode = false;
    this.isCreatingQuiz = true; 
    this.newQuiz = {
      quizId: 0,
      title: '',
      totalMarks: 0,
      questions: {},
      options: {}, 
      correctAnswers: {},
      courseId: this.courseId
    };

  }

  getQuestionKeys(): string[] {
    return Object.keys(this.newQuiz.questions || {});
  }

  /** Cancel quiz creation */
  cancelQuizCreation(): void {
    this.isCreatingQuiz = false;
    this.isEditQuizMode = false;
  }

  /** Adds a new question */
  addQuestion(): void {
    const nextKey = Object.keys(this.newQuiz.questions).length + 1;
    this.newQuiz.questions[nextKey] = '';
    this.newQuiz.correctAnswers[nextKey] = '';
    this.cdRef.detectChanges(); 
  }

  /** Removes a question */
  removeQuestion(key: number): void {
    delete this.newQuiz.questions[key];
    delete this.newQuiz.correctAnswers[key];
    this.cdRef.detectChanges(); 
  }

  /** Deletes a quiz */
  deleteQuiz(quizId: number): void {
    this.quizService.deleteQuiz(quizId).subscribe(() => {
      console.log("Quiz deleted successfully:", quizId);
      window.location.reload(); // Reload the page to reflect changes
     
    });
  }

  
/** Add an option for a specific question */
addOption(questionId: number): void {
  if (!this.newQuiz.options[questionId]) {
    this.newQuiz.options[questionId] = [];
  }
  this.newQuiz.options[questionId].push('');
  this.cdRef.detectChanges();
}

/** Remove an option */
removeOption(questionId: number, optionIndex: number): void {
  this.newQuiz.options[questionId].splice(optionIndex, 1);
  this.cdRef.detectChanges();
}

/** Get option keys for mapping options */
getOptionKeys(questionId: number): number[] {
  return this.newQuiz.options[questionId] ? this.newQuiz.options[questionId].map((_, i) => i) : [];
}


saveQuiz(): void {
  this.quizService.createQuiz(this.newQuiz).subscribe({
    next: (response) => {
      console.log("Quiz created successfully!", response);
      this.isCreatingQuiz = false;
      this.isSubmitting = false;
      window.location.reload(); // Reload the page to reflect changes
      // Reload the page to reflect changes
    },
    error: (err) => {
      console.error("Quiz creation failed:", err);
      this.isSubmitting = false;
    }
  });
}
  loadCourseQuizzes(courseId: number): void {
    this.quizService.getQuizzesByCourseId(courseId).subscribe({
      next: (data: Quiz[]) => {
        console.log("Fetched Quizzes for Course ID:", courseId, data);
        
        this.quizzes = data;
        this.paginateQuizzes();
      },
      error: (err) => console.error("Error fetching course quizzes:", err)
    });
  }
  
  
  /** Enables pagination for quizzes */
  paginateQuizzes(): void {
    const startIndex = (this.currentPage - 1) * this.quizzesPerPage;
    this.paginatedQuizzes = this.quizzes.slice(startIndex, startIndex + this.quizzesPerPage);
  }

  /** Navigates to next page of quizzes */
  nextPage(): void {
    if (this.currentPage * this.quizzesPerPage < this.quizzes.length) {
      this.currentPage++;
      this.paginateQuizzes();
    }
  }

  /** Navigates to previous page of quizzes */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateQuizzes();
    }
  }
}




