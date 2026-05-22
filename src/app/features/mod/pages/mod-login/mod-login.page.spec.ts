import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModLoginPage } from './mod-login.page';

describe('ModLoginPage', () => {
  let component: ModLoginPage;
  let fixture: ComponentFixture<ModLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
