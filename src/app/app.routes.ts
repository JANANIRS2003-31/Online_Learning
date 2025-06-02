import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BodyComponent } from './body/body.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { RegistrationComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import { CourseComponent } from './course/course.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {path:"login",component:LoginComponent},
    {path:"registration",component:RegistrationComponent},
    {path:"about",component:AboutUsComponent},
    {path:"body",component:BodyComponent},
    {path:"course",component:CourseComponent },//canActivate:[authGuard]
    {path:"",component:BodyComponent}
];
