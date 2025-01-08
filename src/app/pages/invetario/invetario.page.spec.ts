import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvetarioPage } from './invetario.page';

describe('InvetarioPage', () => {
  let component: InvetarioPage;
  let fixture: ComponentFixture<InvetarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InvetarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
