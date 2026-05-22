import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordModalPage } from './change-password-modal.page';

describe('ChangePasswordModalPage', () => {
  let component: ChangePasswordModalPage;
  let fixture: ComponentFixture<ChangePasswordModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
