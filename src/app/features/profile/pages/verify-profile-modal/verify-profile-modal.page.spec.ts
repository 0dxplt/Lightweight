import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyProfileModalPage } from './verify-profile-modal.page';

describe('VerifyProfileModalPage', () => {
  let component: VerifyProfileModalPage;
  let fixture: ComponentFixture<VerifyProfileModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyProfileModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
