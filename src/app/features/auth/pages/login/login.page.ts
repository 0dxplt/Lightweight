import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { IonContent, IonItem, IonButton, IonInput, IonIcon } from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth-service';

import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from 'src/app/shared/global';
import { ToastController } from '@ionic/angular';
import { ModAuthService } from 'src/app/features/mod/services/mod-auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon,
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonItem,
    IonButton,
    IonInput,
    RouterModule]
})
export class LoginPage implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(MIN_PASSWORD_LENGTH),
      Validators.maxLength(MAX_PASSWORD_LENGTH)
    ])
  });

  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private modAuthService: ModAuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.invalid) return;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this._showToast(res.message, 'success', 1000);
        this.modAuthService.logout();
        this.router.navigate(["/tabs/workouts"]);
      },
      error: (err) => {
        this._showToast("Errore login: " + (err.error?.message ?? "Unkown"), 'danger', 1000);
      }
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private async _showToast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: duration
    });
    await toast.present();
  }

  minPasswordLength(): number {
    return MIN_PASSWORD_LENGTH;
  }

  maxPasswordLength(): number {
    return MAX_PASSWORD_LENGTH;
  }
}