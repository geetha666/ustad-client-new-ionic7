import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationPage } from './estimation.page';

describe('EstimationPage', () => {
  let component: EstimationPage;
  let fixture: ComponentFixture<EstimationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstimationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
