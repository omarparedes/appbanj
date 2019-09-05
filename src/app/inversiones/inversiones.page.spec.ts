import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InversionesPage } from './inversiones.page';

describe('InversionesPage', () => {
  let component: InversionesPage;
  let fixture: ComponentFixture<InversionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InversionesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InversionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
