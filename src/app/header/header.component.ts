import { Component, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginserviceService } from '../loginservice.service';
import { CommonServiceService } from '../common-service.service';
import { CommonModule } from '@angular/common';

declare var bootstrap: any; // Ensure Bootstrap JS is loaded

@Component({
  selector: 'header',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit {
  userRole: string = '';
  @ViewChild('navbarNavRef') navbarCollapseRef!: ElementRef;
  @ViewChild('navbarToggler') navbarTogglerRef!: ElementRef;

  constructor(private loginService: LoginserviceService, private commonService: CommonServiceService, private router: Router) { }

  ngAfterViewInit() {
    // Initialization logic if any
  }

  get role(){
    return this.commonService.getUserRole();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.navbarCollapseRef && this.navbarCollapseRef.nativeElement.classList.contains('show')) {
      if (!this.navbarCollapseRef.nativeElement.contains(event.target as Node) &&
          !this.navbarTogglerRef.nativeElement.contains(event.target as Node)) {
        this.closeNavbar();
      }
    }
  }

  // This method will now be called directly from HTML clicks
  closeNavbar() {
    if (this.navbarCollapseRef && (typeof bootstrap !== 'undefined' && bootstrap.Collapse)) {
        const bsCollapse = new bootstrap.Collapse(this.navbarCollapseRef.nativeElement, {
            toggle: false
        });
        bsCollapse.hide();
    } else {
        // Fallback for manual class toggling if Bootstrap JS isn't available
        if (this.navbarCollapseRef) {
            this.navbarCollapseRef.nativeElement.classList.remove('show');
            this.navbarTogglerRef.nativeElement.setAttribute('aria-expanded', 'false');
        }
    }
  }

  logout() {
    localStorage.clear();
    this.loginService.logout(); // Assuming this handles the actual logout process
    // No need to call closeNavbar() here if it's called from HTML (click)="logout(); closeNavbar()"
    // or if the logout process itself navigates and the navbar is destroyed/re-initialized
  }

  get isLogedIn(): boolean {
    if (this.commonService.getToken()) {
      return true;
    } else {
      return this.loginService.getLoginStatus();
    }
  }

  navigatetoprogress() {
    if (this.commonService.getToken()) {
      this.userRole = this.commonService.getUserRole();
      if (this.userRole === 'ADMIN' || this.userRole === 'INSTRUCTOR') {
        this.router.navigate(['/adminprogressdashboard']);
      } else if (this.userRole === 'STUDENT') {
        this.router.navigate(['/progressdashboard']);
      }
      // No need to call closeNavbar() here if it's called from HTML (click)="navigatetoprogress(); closeNavbar()"
    }
  }
}