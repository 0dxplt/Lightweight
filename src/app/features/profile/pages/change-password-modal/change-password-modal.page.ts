import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from 'src/app/shared/global';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('newPassword');
  const confirmPassword = control.get('repeatPass');

  if (!password || !confirmPassword) return null;

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.page.html',
  styleUrls: ['./change-password-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ChangePasswordModalPage implements OnInit {

  changePasswordFormGroup: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH), Validators.maxLength(MAX_PASSWORD_LENGTH)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH), Validators.maxLength(MAX_PASSWORD_LENGTH)]),
    repeatPass: new FormControl('', [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH), Validators.maxLength(MAX_PASSWORD_LENGTH)])
  }, { validators: passwordMatchValidator });

  oldPasswordType = signal<"text" | "password">("password");
  newPasswordType = signal<"text" | "password">("password");
  repPasswordType = signal<"text" | "password">("password");

  showOld = computed(() => {
    return this.oldPasswordType() === "text";
  });

  showNew = computed(() => {
    return this.newPasswordType() === "text";
  });

  showRep = computed(() => {
    return this.repPasswordType() === "text";
  });

  constructor(
    private location: Location,
    private modalController: ModalController
  ) {
    addIcons({eyeOffOutline, eyeOutline});
  }

  ngOnInit() {
  }

  private _dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalController.dismiss({
      old: this.changePasswordFormGroup.value.oldPassword,
      new: this.changePasswordFormGroup.value.newPassword
    }, 'confirm');
  }

  toggleOld() {
    this.oldPasswordType.update(t => t === "password" ? "text" : "password");
  }

  toggleNew() {
    this.newPasswordType.update(t => t === "password" ? "text" : "password");
  }

  toggleRep() {
    this.repPasswordType.update(t => t === "password" ? "text" : "password");
  }
}
