import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProvedoresPage } from './provedores.page';

describe('ProvedoresPage', () => {
  let component: ProvedoresPage;
  let fixture: ComponentFixture<ProvedoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvedoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
