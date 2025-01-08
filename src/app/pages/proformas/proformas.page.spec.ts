import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProformasPage } from './proformas.page';

describe('ProformasPage', () => {
  let component: ProformasPage;
  let fixture: ComponentFixture<ProformasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
