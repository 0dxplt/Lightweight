import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionViewModalPage } from './session-view-modal.page';

describe('SessionViewModalPage', () => {
  let component: SessionViewModalPage;
  let fixture: ComponentFixture<SessionViewModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionViewModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
