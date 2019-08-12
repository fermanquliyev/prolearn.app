import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectContentPage } from './subject-content.page';

describe('SubjectContentPage', () => {
  let component: SubjectContentPage;
  let fixture: ComponentFixture<SubjectContentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectContentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
