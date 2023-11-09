import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationmapPage } from './locationmap.page';

describe('LocationmapPage', () => {
  let component: LocationmapPage;
  let fixture: ComponentFixture<LocationmapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationmapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationmapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
