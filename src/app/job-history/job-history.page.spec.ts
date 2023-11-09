import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobHistoryPage } from './job-history.page';

describe('JobHistoryPage', () => {
  let component: JobHistoryPage;
  let fixture: ComponentFixture<JobHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobHistoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
