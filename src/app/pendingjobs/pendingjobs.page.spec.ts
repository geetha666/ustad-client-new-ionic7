import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingjobsPage } from './pendingjobs.page';

describe('PendingjobsPage', () => {
  let component: PendingjobsPage;
  let fixture: ComponentFixture<PendingjobsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingjobsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingjobsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
