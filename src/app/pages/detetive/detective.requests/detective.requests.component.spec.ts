import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectiveRequestsComponent } from './detective.requests.component';

describe('DetectiveRequestsComponent', () => {
  let component: DetectiveRequestsComponent;
  let fixture: ComponentFixture<DetectiveRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetectiveRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetectiveRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
