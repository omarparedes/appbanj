import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstrategiaPage } from './estrategia.page';

describe('EstrategiaPage', () => {
  let component: EstrategiaPage;
  let fixture: ComponentFixture<EstrategiaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstrategiaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstrategiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
