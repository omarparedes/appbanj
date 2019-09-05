import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrlvPage } from './prlv.page';

describe('PrlvPage', () => {
  let component: PrlvPage;
  let fixture: ComponentFixture<PrlvPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrlvPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrlvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
