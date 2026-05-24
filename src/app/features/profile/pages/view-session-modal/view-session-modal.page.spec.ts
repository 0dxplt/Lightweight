import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewSessionModalPage } from './view-session-modal.page';

describe('ViewSessionModalPage', () => {
  let component: ViewSessionModalPage;
  let fixture: ComponentFixture<ViewSessionModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSessionModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
