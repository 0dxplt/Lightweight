import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PtRequestModalPage } from './pt-request-modal.page';

describe('PtRequestModalPage', () => {
  let component: PtRequestModalPage;
  let fixture: ComponentFixture<PtRequestModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PtRequestModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
