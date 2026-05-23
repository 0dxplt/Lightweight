import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistProfilePagePage } from './vist-profile-page.page';

describe('VistProfilePagePage', () => {
  let component: VistProfilePagePage;
  let fixture: ComponentFixture<VistProfilePagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistProfilePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
