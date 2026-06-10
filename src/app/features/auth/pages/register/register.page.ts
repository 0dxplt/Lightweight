import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonInputPasswordToggle, IonButton, IonRouterLink, IonText } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth-service';
import { Router, RouterModule } from '@angular/router';
import { MAX_HEIGHT_VALUE, MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH, MAX_WEIGHT_VALUE, MIN_HEIGHT_VALUE, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, MIN_WEIGHT_VALUE } from 'src/app/shared/global';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonText, IonRouterLink, IonButton, IonInput, IonContent, CommonModule, ReactiveFormsModule, FormsModule, IonInputPasswordToggle, RouterModule]
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(MIN_USERNAME_LENGTH), Validators.maxLength(MAX_USERNAME_LENGTH)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(MIN_PASSWORD_LENGTH),
      Validators.maxLength(MAX_PASSWORD_LENGTH)
    ]),
    weight: new FormControl('', [
      Validators.required,
      Validators.min(MIN_WEIGHT_VALUE),
      Validators.max(MAX_WEIGHT_VALUE)
    ]),
    height: new FormControl('', [
      Validators.required,
      Validators.min(MIN_HEIGHT_VALUE),
      Validators.max(MAX_HEIGHT_VALUE)
    ]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const username = this.registerForm.value.username;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const weight = this.registerForm.value.weight;
    const height = this.registerForm.value.height;

    this.authService.register(username, email, password, weight, height).subscribe({
      next: (res) => {
        this._showToast(res.message, 'success', 1000);
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        this._showToast("Errore: " + (err.error?.message ?? "Unkown"), 'danger', 2000);
      }
    });
  }

  private async _showToast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: duration
    });
    await toast.present();
  }

  usernameMinLength(): number {
    return MIN_USERNAME_LENGTH;
  }

  usernameMaxLength(): number {
    return MAX_USERNAME_LENGTH;
  }

  usernameErrorText(): string {
    return `Username must be ${MIN_USERNAME_LENGTH}-${MAX_USERNAME_LENGTH} characters long`;
  }

  passwordMinLength(): number {
    return MIN_PASSWORD_LENGTH;
  }

  passwordMaxLength(): number {
    return MAX_PASSWORD_LENGTH;
  }

  passwordErrorText(): string {
    return `Password must be ${MIN_PASSWORD_LENGTH}-${MAX_PASSWORD_LENGTH} characters long`;
  }

  weightErrorText(): string {
    return `Weight must be between ${MIN_WEIGHT_VALUE} and ${MAX_WEIGHT_VALUE} (kg)`;
  }

  heightErrorText(): string {
    return `Height must be between ${MIN_HEIGHT_VALUE} and ${MAX_HEIGHT_VALUE} (cm)`;
  }
}
