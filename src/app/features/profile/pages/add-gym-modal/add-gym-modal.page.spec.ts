import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGymModalPage } from './add-gym-modal.page';

describe('AddGymModalPage', () => {
  let component: AddGymModalPage;
  let fixture: ComponentFixture<AddGymModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGymModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
