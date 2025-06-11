import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProgressDashboardComponent } from './admin-progress-dashboard.component';

describe('AdminProgressDashboardComponent', () => {
  let component: AdminProgressDashboardComponent;
  let fixture: ComponentFixture<AdminProgressDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProgressDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProgressDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
