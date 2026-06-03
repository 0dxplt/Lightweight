import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from 'src/app/shared/global';

export const passwordMatchValidator: ValidatorFn = (group: AbstractControl) => {
  const password = group.get('newPassword');
  const repeat = group.get('repeatPass');

  if (!password || !repeat) return null;

  if (password.value !== repeat.value) {
    repeat.setErrors({ passwordMismatch: true });
  } else if (repeat.hasError('passwordMismatch')) {
    repeat.setErrors(null);
  }

  return null;
};

export const differentPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('newPassword');
  const oldPassword = control.get('oldPassword');

  if (!password || !oldPassword) return null;
  
  if (password.value === oldPassword.value) {
    password.setErrors({ passwordMatch: true });
  } else if (password.hasError('passwordMatch')) {
    password.setErrors(null);
  }

  return password.value !== oldPassword.value ? null : { passwordMatch: true };
}

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
  }, { validators: [passwordMatchValidator, differentPasswordValidator] });

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

  minPasswordLength(): number {
    return MIN_PASSWORD_LENGTH;
  }

  maxPasswordLength(): number {
    return MAX_PASSWORD_LENGTH;
  }

  oldPasswordError(): string {
    return `Password must be ${MIN_PASSWORD_LENGTH}-${MAX_PASSWORD_LENGTH} charaters long`;
  }

  newPasswordError(): string {
    const newPasswordControl = this.changePasswordFormGroup.get('newPassword');
    if (newPasswordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (newPasswordControl?.hasError('minlength') || newPasswordControl?.hasError('maxlength')) {
      return `Password must be ${MIN_PASSWORD_LENGTH}-${MAX_PASSWORD_LENGTH} characters long`;
    }
    if (newPasswordControl?.hasError('passwordMatch')) {
      return 'New password must be different from old password';
    }
    return '';
  }
 
  repeatPasswordError(): string {
    const repeatPassControl = this.changePasswordFormGroup.get('repeatPass');
    if (repeatPassControl?.hasError('required')) return 'Password is required';
    if (repeatPassControl?.hasError('minlength') || repeatPassControl?.hasError('maxlength')) {
      return `Password must be ${MIN_PASSWORD_LENGTH}-${MAX_PASSWORD_LENGTH} characters long`;
    }
    if (repeatPassControl?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}
