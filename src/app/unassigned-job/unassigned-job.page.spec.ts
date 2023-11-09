import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassignedJobPage } from './unassigned-job.page';

describe('UnassignedJobPage', () => {
  let component: UnassignedJobPage;
  let fixture: ComponentFixture<UnassignedJobPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnassignedJobPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnassignedJobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
