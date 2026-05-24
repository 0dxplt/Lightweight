import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PtInfoModalPage } from './pt-info-modal.page';

describe('PtInfoModalPage', () => {
  let component: PtInfoModalPage;
  let fixture: ComponentFixture<PtInfoModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PtInfoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
