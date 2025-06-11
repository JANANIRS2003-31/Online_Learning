import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../quiz.service';
import { CommonServiceService } from '../common-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'quiz-attempt',
  imports: [FormsModule, CommonModule],
  templateUrl: './quiz-attempt.component.html',
  styleUrls: ['./quiz-attempt.component.css']
})
export class QuizAttemptComponent implements OnInit {
  quizId!: number;
  courseId!: number; // Assuming you will get this from the route or service
  userId!: number;
  quizDetails: any = {};
  submissionDetails: any = null;
  userAnswers: { [key: number]: string } = {};
  isLoading: boolean = true;
  isTakingQuiz: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private commonService: CommonServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));

    this.commonService.getUserId().subscribe({
     next: (userId) => {
       this.userId = userId;

        if (!this.quizId || !this.userId) {
          console.error('Invalid Quiz or User ID');
          return;
        }

        this.fetchQuizDetails();
        this.checkQuizSubmission();
      },
      error: (err) => console.error('Error fetching user ID:', err)
    });
  }

  fetchQuizDetails(): void {
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quizDetails = quiz;
        this.isLoading = false;
        this.courseId = quiz.courseId;
        console.log("Fetched Quiz Details:", this.quizDetails);
      },
      error: (err) => console.error('Error fetching quiz:', err)
    });
  }

  checkQuizSubmission(): void {
    this.quizService.getQuizSubmissionByUserIdAndQuizId(this.userId, this.quizId).subscribe({
      next: (submission) => {
        this.submissionDetails = submission;
        console.log("Fetched Quiz Submission:", this.submissionDetails);
      },
      error: () => {
        this.submissionDetails = null;
        console.warn("No previous submission found. User can attempt the quiz.");
      }
    });
  }

  startQuiz(): void {
    console.log("Starting quiz for Quiz ID:", this.quizId);
    this.isTakingQuiz = true;
    this.userAnswers = {};
  }

  goBack(): void {
    this.router.navigate([`/coursecontent/${this.courseId}/quizzes`]);
  }
  
  submitQuiz(): void {
    const formattedResponses = Object.keys(this.quizDetails.questions).reduce((acc, key) => {
      acc[Number(key)] = this.userAnswers[key] || '';
      return acc;
    }, {} as { [key: number]: string });

    const quizSubmission = {
      quizId: this.quizId,
      userId: this.userId,
      responses: formattedResponses
    };

    this.quizService.submitQuiz(quizSubmission).subscribe({
      next: (result) => {
        console.log("Quiz Submission Result:", result);
        this.submissionDetails = result;
        this.isTakingQuiz = false;
      },
      error: (err) => {
        console.error("Error submitting quiz:", err);
        alert("Quiz submission failed. Please try again.");
      }
    });
  }
}

