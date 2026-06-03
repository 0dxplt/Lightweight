import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonItem, IonButton, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { ModAuthService } from '../../services/mod-auth-service';
import { Router } from '@angular/router';
import { MAX_MOD_PASSWORD_LENGTH, MAX_MOD_USERNAME_LENGTH, MIN_MOD_PASSWORD_LENGTH, MIN_MOD_USERNAME_LENGTH } from 'src/app/shared/global';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/features/auth/services/auth-service';

@Component({
  selector: 'app-mod-login',
  templateUrl: './mod-login.page.html',
  styleUrls: ['./mod-login.page.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonItem, IonIcon, IonContent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ModLoginPage implements OnInit {

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(MIN_MOD_USERNAME_LENGTH), Validators.maxLength(MAX_MOD_USERNAME_LENGTH)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(MIN_MOD_PASSWORD_LENGTH), Validators.maxLength(MAX_MOD_PASSWORD_LENGTH)])
  })
  showPassword: boolean = false;

  constructor(
    private authService: ModAuthService,
    private userAuthService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({eyeOffOutline, eyeOutline});
  }

  ngOnInit() {}

  onSubmit() {
    if (!this.loginForm.valid) return;

    const username: string = this.loginForm.value.username;
    const email: string = this.loginForm.value.email;
    const password: string = this.loginForm.value.password;

    this.authService.login(username, email, password).subscribe({
      next: (res) => {
        this._showToast(res.message, 'success', 1000);
        this.userAuthService.logout();
        this.router.navigate(["mod"]);
      },
      error: (err) => {
        this._showToast(("Errore: " + (err.error?.message ?? "Unkown")), 'danger', 2000);
      }
    });
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

  usernameMinLength(): number {
    return MIN_MOD_USERNAME_LENGTH;
  }

  usernameMaxLength(): number {
    return MAX_MOD_USERNAME_LENGTH;
  }

  usernameErrorText(): string {
    return `Username must be ${MIN_MOD_USERNAME_LENGTH}-${MAX_MOD_USERNAME_LENGTH} charaters long`;
  }

  passwordMinLength(): number {
    return MIN_MOD_PASSWORD_LENGTH;
  }

  passwordMaxLength(): number {
    return MAX_MOD_PASSWORD_LENGTH;
  }

  passwordErrorText(): string {
    return `Password must be ${MIN_MOD_PASSWORD_LENGTH}-${MAX_MOD_PASSWORD_LENGTH} charaters long`;
  }
}
