import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { MAX_NAME_LENGTH, MAX_SURNAME_LENGTH, MIN_NAME_LENGTH, MIN_SURNAME_LENGTH, NAME_REGEX, SURNAME_REGEX } from 'src/app/shared/global';
import { NationService } from 'src/app/shared/services/nation-service';

@Component({
  selector: 'app-verify-profile-modal',
  templateUrl: './verify-profile-modal.page.html',
  styleUrls: ['./verify-profile-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class VerifyProfileModalPage implements OnInit {

  user = this.authService.user;
  nations = this.nationService.allNations();
  verifyForm = new FormGroup({});
  missingFields: string[] = [];

  constructor(private modalController: ModalController, private authService: AuthService, private nationService: NationService) { }

  ngOnInit() {
    const u = this.user();
    if (!u) {
      this.cancel();
      return;
    }

    if (!u.name) {
      this.verifyForm.addControl('name', new FormControl('', [Validators.required, Validators.minLength(MIN_NAME_LENGTH), Validators.maxLength(MAX_NAME_LENGTH), Validators.pattern(NAME_REGEX)]));
      this.missingFields.push('name');
    }

    if (!u.surname) {
      this.verifyForm.addControl('surname', new FormControl('', [Validators.required, Validators.minLength(MIN_SURNAME_LENGTH), Validators.maxLength(MAX_SURNAME_LENGTH), Validators.pattern(SURNAME_REGEX)]));
      this.missingFields.push('surname');
    }

    if (!u.birthdate) {
      this.verifyForm.addControl('birthdate', new FormControl('', [Validators.required]));
      this.missingFields.push('birthdate');
    }

    if (!u.nationality) {
      this.verifyForm.addControl('nationality', new FormControl(null, [Validators.required]));
      this.missingFields.push('nationality');
    }

    if (this.missingFields.length === 0) {
      this._autoConfirm();
    }
  }

  private _autoConfirm() {
    setTimeout(() => {
      this.modalController.dismiss({ alreadyValid: true }, 'already-valid');
    }, 100);
  }

  confirm() {
    if (this.verifyForm.valid) {
      this.modalController.dismiss(this.verifyForm.value, 'confirm');
    }
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

}
