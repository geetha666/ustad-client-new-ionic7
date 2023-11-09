import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HireLaterPage } from './hire-later.page';

describe('HireLaterPage', () => {
  let component: HireLaterPage;
  let fixture: ComponentFixture<HireLaterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HireLaterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HireLaterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
