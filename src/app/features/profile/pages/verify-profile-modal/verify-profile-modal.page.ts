import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { MAX_NAME_LENGTH, MAX_SURNAME_LENGTH, MIN_NAME_LENGTH, MIN_SURNAME_LENGTH, NAME_REGEX, SURNAME_REGEX } from 'src/app/shared/global';
import { NationService } from 'src/app/shared/services/nation-service';
import { Nation } from 'src/app/models/nation.model';

@Component({
  selector: 'app-verify-profile-modal',
  templateUrl: './verify-profile-modal.page.html',
  styleUrls: ['./verify-profile-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class VerifyProfileModalPage implements OnInit {

  user = this.authService.user;
  nations =  signal<Nation[]>([]);
  verifyForm = new FormGroup({});
  missingFields: string[] = [];

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private nationService: NationService
  ) {}

  ngOnInit() {
    this.nationService.all().subscribe(nations => {
      nations.forEach(n => {
        this.nations.update(value => {
          value.push(n);
          return value
        });
      });
    });

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
      this.verifyForm.addControl('nationality', new FormControl('', [Validators.required]));
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

  
  minNameLength(): number {
    return MIN_NAME_LENGTH;
  }

  maxNameLength(): number {
    return MAX_NAME_LENGTH;
  }

  nameErrorText(): string {
    const name: string = this.verifyForm.get('name')?.value || '';
    if (!name.match(NAME_REGEX))
      return "Name does not match the regex";
    else
      return `Name must be ${MIN_NAME_LENGTH}-${MAX_NAME_LENGTH} characters long`;
  }

  minSurnameLength(): number {
    return MIN_NAME_LENGTH;
  }

  maxSurnameLength(): number {
    return MAX_NAME_LENGTH;
  }

  surnameErrorText(): string {
    const surname: string = this.verifyForm.get('surname')?.value || '';
    if (!surname.match(SURNAME_REGEX))
      return "Surname does not match the regex";
    else
      return `Surname must be ${MIN_NAME_LENGTH}-${MAX_NAME_LENGTH} characters long`;
  }

  customSelectFilter = {
    cssClass: 'modal-select-custom'
  };
}