import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDetetivesComponent } from './manage-detetives.component';

describe('ManageDetetivesComponent', () => {
  let component: ManageDetetivesComponent;
  let fixture: ComponentFixture<ManageDetetivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDetetivesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDetetivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
