import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistervalidationPage } from './registervalidation.page';

describe('RegistervalidationPage', () => {
  let component: RegistervalidationPage;
  let fixture: ComponentFixture<RegistervalidationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistervalidationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistervalidationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
