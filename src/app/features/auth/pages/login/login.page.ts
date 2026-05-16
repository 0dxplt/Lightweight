import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { IonContent, IonItem, IonButton, IonInput, IonIcon } from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth-service';

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
      Validators.minLength(8),
      Validators.maxLength(32)
    ])
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.invalid) return;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    console.log("Email:", email);
    console.log("Password:", password);

    this.authService.login(email, password);

    if (this.authService.isLogged())
      this.router.navigate(["/tabs/workouts"]);
  }
}