import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BodyComponent } from './body/body.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { RegistrationComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import { CourseComponent } from './course/course.component';
import { authGuard } from './auth.guard';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { CourseContentComponent } from './coursecontent/coursecontent.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizAttemptComponent } from './quiz-attempt/quiz-attempt.component';
import { ProgressDashboardComponent } from './progress-dashboard/progress-dashboard.component';
import { AdminProgressDashboardComponent } from './admin-progress-dashboard/admin-progress-dashboard.component';
import { ContactUsComponent } from './contact/contact.component';
import { auth2Guard } from './auth2.guard';
import { StudentlistComponent } from './studentlist/studentlist.component';


export const routes: Routes = [
    {path:"login",component:LoginComponent},
    {path:"registration",component:RegistrationComponent},
    {path:"about",component:AboutUsComponent},
    { path: "contact", component: ContactUsComponent},
    {path:"body",component:BodyComponent},
    {path:"course",component:CourseComponent ,canActivate:[authGuard]},
    {path:"",component:BodyComponent},
    {path:"enrollment",component:EnrollmentComponent ,canActivate:[auth2Guard]},
    {path: 'coursecontent/:id', component: CourseContentComponent},
    {path:"coursecontent",component:CourseContentComponent},
    { path: 'coursecontent/:id', component: CourseContentComponent },
    { path: 'quiz', component: QuizComponent },
    { path: 'coursecontent/:id/quizzes', component: QuizComponent},
    { path: 'quiz-attempt/:id', component: QuizAttemptComponent },
    { path: 'progressdashboard', component: ProgressDashboardComponent },
    { path: 'adminprogressdashboard', component: AdminProgressDashboardComponent },
    {path: 'studentlist', component: StudentlistComponent,canActivate:[authGuard]},
    { path: '**', redirectTo: '/', pathMatch: 'full' } 
    
];
