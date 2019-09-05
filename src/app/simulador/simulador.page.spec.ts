import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuladorPage } from './simulador.page';

describe('SimuladorPage', () => {
  let component: SimuladorPage;
  let fixture: ComponentFixture<SimuladorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimuladorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimuladorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
