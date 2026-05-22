import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolvedPage } from './solved.page';

describe('SolvedPage', () => {
  let component: SolvedPage;
  let fixture: ComponentFixture<SolvedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolvedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
