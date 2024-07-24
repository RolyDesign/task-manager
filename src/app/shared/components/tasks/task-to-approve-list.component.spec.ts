import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskToApproveListComponent } from './task-to-approve-list.component';

describe('TaskToApproveListComponent', () => {
  let component: TaskToApproveListComponent;
  let fixture: ComponentFixture<TaskToApproveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskToApproveListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskToApproveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
