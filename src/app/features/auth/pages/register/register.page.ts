import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonInputPasswordToggle, IonButton, IonRippleEffect, IonRouterLink, IonText } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth-service';
import { Router, RouterModule } from '@angular/router';
import { MAX_HEIGHT_VALUE, MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH, MAX_WEIGHT_VALUE, MIN_HEIGHT_VALUE, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, MIN_WEIGHT_VALUE } from 'src/app/shared/global';

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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const username = this.registerForm.value.username;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const weight = this.registerForm.value.weight;
    const height = this.registerForm.value.height;

    console.log(username, email, password, weight, height);

    this.authService.register(username, email, password, weight, height);

    if (this.authService.isLogged())
      this.router.navigate(["/tabs/workouts/"]);
  }

}
