import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FollowersModalPage } from './followers-modal.page';

describe('FollowersModalPage', () => {
  let component: FollowersModalPage;
  let fixture: ComponentFixture<FollowersModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowersModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
