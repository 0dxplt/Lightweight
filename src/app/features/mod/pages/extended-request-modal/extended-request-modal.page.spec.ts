import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtendedRequestModalPage } from './extended-request-modal.page';

describe('ExtendedRequestModalPage', () => {
  let component: ExtendedRequestModalPage;
  let fixture: ComponentFixture<ExtendedRequestModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedRequestModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
