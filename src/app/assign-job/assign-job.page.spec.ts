import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignJobPage } from './assign-job.page';

describe('AssignJobPage', () => {
  let component: AssignJobPage;
  let fixture: ComponentFixture<AssignJobPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignJobPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignJobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
