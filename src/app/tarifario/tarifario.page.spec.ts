import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifarioPage } from './tarifario.page';

describe('TarifarioPage', () => {
  let component: TarifarioPage;
  let fixture: ComponentFixture<TarifarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifarioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
