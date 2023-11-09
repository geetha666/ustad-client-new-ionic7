import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InprogressjobPage } from './inprogressjob.page';

describe('InprogressjobPage', () => {
  let component: InprogressjobPage;
  let fixture: ComponentFixture<InprogressjobPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InprogressjobPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InprogressjobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
