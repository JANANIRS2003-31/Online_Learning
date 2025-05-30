import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AboutUsComponent } from '../about-us/about-us.component';
import { LoginserviceService } from '../loginservice.service';

@Component({
  selector: 'header',
  imports: [RouterOutlet,RouterLink,LoginComponent,AboutUsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  constructor(private loginService:LoginserviceService){}
  logout(){
    localStorage.clear()
    return this.loginService.logout();
   }
 
  get isLogedIn(): boolean{
    return this.loginService.getLoginStatus();
  }
 
}
 
