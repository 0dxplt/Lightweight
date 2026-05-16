import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentSessionPage } from './current-session.page';

describe('CurrentSessionPage', () => {
  let component: CurrentSessionPage;
  let fixture: ComponentFixture<CurrentSessionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
