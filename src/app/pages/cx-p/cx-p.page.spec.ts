import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CxPPage } from './cx-p.page';

describe('CxPPage', () => {
  let component: CxPPage;
  let fixture: ComponentFixture<CxPPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CxPPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
