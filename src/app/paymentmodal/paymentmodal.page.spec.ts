import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentmodalPage } from './paymentmodal.page';

describe('PaymentmodalPage', () => {
  let component: PaymentmodalPage;
  let fixture: ComponentFixture<PaymentmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
