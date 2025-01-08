import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CxCPage } from './cx-c.page';

describe('CxCPage', () => {
  let component: CxCPage;
  let fixture: ComponentFixture<CxCPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CxCPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
