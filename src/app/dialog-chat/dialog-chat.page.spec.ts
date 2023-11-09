import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChatPage } from './dialog-chat.page';

describe('DialogChatPage', () => {
  let component: DialogChatPage;
  let fixture: ComponentFixture<DialogChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogChatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
