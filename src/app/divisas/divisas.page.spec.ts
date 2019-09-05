import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisasPage } from './divisas.page';

describe('DivisasPage', () => {
  let component: DivisasPage;
  let fixture: ComponentFixture<DivisasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
