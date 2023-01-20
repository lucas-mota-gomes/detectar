import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectiveRequestDetailComponent } from './detective.request-detail.component';

describe('DetectiveRequestDetailComponent', () => {
  let component: DetectiveRequestDetailComponent;
  let fixture: ComponentFixture<DetectiveRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetectiveRequestDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetectiveRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
