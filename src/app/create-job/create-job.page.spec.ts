import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobPage } from './create-job.page';

describe('CreateJobPage', () => {
  let component: CreateJobPage;
  let fixture: ComponentFixture<CreateJobPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateJobPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
