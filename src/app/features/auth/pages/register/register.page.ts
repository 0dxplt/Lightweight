import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonInputPasswordToggle, IonButton, IonRippleEffect, IonRouterLink, IonText } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonText, IonRouterLink, IonButton, IonInput, IonContent, CommonModule, ReactiveFormsModule, FormsModule, IonInputPasswordToggle, RouterModule]
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32)
    ]),
    weight: new FormControl('', [
      Validators.required,
      Validators.min(30),
      Validators.max(400)
    ]),
    height: new FormControl('', [
      Validators.required,
      Validators.min(140),
      Validators.max(240)
    ]),
  });

  constructor(private authService: AuthService) { }

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
  }

}
