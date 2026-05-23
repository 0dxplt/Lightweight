import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FollowingModalPage } from './following-modal.page';

describe('FollowingModalPage', () => {
  let component: FollowingModalPage;
  let fixture: ComponentFixture<FollowingModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
