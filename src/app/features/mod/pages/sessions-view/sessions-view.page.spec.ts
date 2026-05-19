import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionViewPage } from './sessions-view.page';

describe('SessionViewPage', () => {
  let component: SessionViewPage;
  let fixture: ComponentFixture<SessionViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
