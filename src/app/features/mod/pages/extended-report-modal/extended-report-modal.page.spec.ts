import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtendedReportModalPage } from './extended-report-modal.page';

describe('ExtendedReportModalPage', () => {
  let component: ExtendedReportModalPage;
  let fixture: ComponentFixture<ExtendedReportModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedReportModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
