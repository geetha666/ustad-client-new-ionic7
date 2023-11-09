import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNamePage } from './edit-name.page';

describe('EditNamePage', () => {
  let component: EditNamePage;
  let fixture: ComponentFixture<EditNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
