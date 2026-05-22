import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonItem, IonButton, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { ModAuthService } from '../../services/mod-auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mod-login',
  templateUrl: './mod-login.page.html',
  styleUrls: ['./mod-login.page.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonItem, IonIcon, IonContent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ModLoginPage implements OnInit {

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)])
  })
  showPassword: boolean = false;

  constructor(private authService: ModAuthService, private router: Router) {
    addIcons({eyeOffOutline, eyeOutline});
  }

  ngOnInit() {}

  onSubmit() {
    if (!this.loginForm.valid) return;

    const username: string = this.loginForm.value.username;
    const email: string = this.loginForm.value.email;
    const password: string = this.loginForm.value.password;

    this.authService.login(username, email, password);

    if (this.authService.isModLogged())
      this.router.navigate(["mod"]);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
