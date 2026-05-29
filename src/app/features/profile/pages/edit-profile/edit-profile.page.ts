import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { MAX_HEIGHT_VALUE, MAX_NAME_LENGTH, MAX_SURNAME_LENGTH, MAX_USERNAME_LENGTH, MAX_WEIGHT_VALUE, MIN_HEIGHT_VALUE, MIN_NAME_LENGTH, MIN_SURNAME_LENGTH, MIN_USERNAME_LENGTH, MIN_WEIGHT_VALUE, NAME_REGEX, PROPIC_PATH, SURNAME_REGEX } from 'src/app/shared/global';
import { NationService } from 'src/app/shared/services/nation-service';
import { CityService } from 'src/app/shared/services/city-service';
import { GymService } from 'src/app/shared/services/gym-service';
import { Nation } from 'src/app/models/nation.model';
import { City } from 'src/app/models/city.model';
import { Gym } from 'src/app/models/gym.model';
import { User } from 'src/app/models/user.model';
import { LoadingController, SelectChangeEventDetail } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonSelectCustomEvent } from '@ionic/core';
import { AddGymModalPage } from '../add-gym-modal/add-gym-modal.page';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})
export class EditProfilePage implements OnInit {

  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);

  user = this.authService.user;
  userForm: FormGroup = new FormGroup({
    username: new FormControl(this.user()?.username, [Validators.required, Validators.minLength(MIN_USERNAME_LENGTH), Validators.maxLength(MAX_USERNAME_LENGTH)]),
    name: new FormControl(this.user()?.name, [Validators.minLength(MIN_NAME_LENGTH), Validators.maxLength(MAX_NAME_LENGTH), Validators.pattern(NAME_REGEX)]),
    surname: new FormControl(this.user()?.surname, [Validators.minLength(MIN_SURNAME_LENGTH), Validators.maxLength(MAX_SURNAME_LENGTH), Validators.pattern(SURNAME_REGEX)]),
    email: new FormControl(this.user()?.email, [Validators.required, Validators.email]),
    birthdate: new FormControl(this.user()?.birthdate),
    weight: new FormControl(this.user()?.weight, [Validators.required, Validators.min(MIN_WEIGHT_VALUE), Validators.max(MAX_WEIGHT_VALUE)]),
    height: new FormControl(this.user()?.height, [Validators.required, Validators.min(MIN_HEIGHT_VALUE), Validators.max(MAX_HEIGHT_VALUE)]),
    nationality: new FormControl(this.user()?.nationality),
    proemail: new FormControl(this.user()?.pt?.proEmail, [Validators.required, Validators.email]),
    city: new FormControl(this.user()?.pt?.city, [Validators.required]),
    gym: new FormControl(this.user()?.pt?.gym, [Validators.required])
  });

  verified = computed(() => {
    const u = this.user();
    if (!u) return false;
    return u.verified;
  });

  isPT = computed(() => {
    const u = this.user();
    if (!u) return false;
    return u.pt !== null && u.pt !== undefined;
  });

  hasPropic = computed(() => {
    const u = this.user();
    if (!u) return false;
    return u.propic !== null && u.propic !== undefined && u.propic !== PROPIC_PATH;
  });

  nations = signal<Nation[]>([]);
  cities = this.cityService.all();
  gyms = this.gymService.all();

  constructor(
    private authService: AuthService,
    private nationService: NationService,
    private cityService: CityService,
    private gymService: GymService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
  ) {}

  ngOnInit() {
      if (!this.isPT()) {
        this.userForm.get('proemail')?.clearValidators();
        this.userForm.get('city')?.clearValidators();
        this.userForm.get('gym')?.clearValidators();
        
        this.userForm.get('proemail')?.updateValueAndValidity();
        this.userForm.get('city')?.updateValueAndValidity();
        this.userForm.get('gym')?.updateValueAndValidity();
    }

    this.nationService.all().subscribe(nations => {
      nations.forEach(n => {
        this.nations.update(value => {
          value.push(n);
          return value;
        })
      });
    });
  }

  compareNationalities(obj1: Nation | undefined | null, obj2: Nation | undefined | null): boolean {
    return obj1 && obj2 ? (
      obj1.id === obj2.id &&
      obj1.name === obj2.name
    ) : obj1 === obj2;
  }

  compareCities(obj1: City | undefined | null, obj2: City | undefined | null): boolean {
    return obj1 && obj2 ? (
      obj1.id === obj2.id &&
      obj1.name === obj2.name
    ) : obj1 === obj2;
  }

  compareGyms(obj1: Gym | undefined | null, obj2: Gym | undefined | null): boolean {
    return obj1 && obj2 ? (
      obj1.id === obj2.id &&
      obj1.name === obj2.name &&
      obj1.address === obj2.address
    ) : obj1 === obj2;
  }

  retrievePropic() {
    // url(backend) + user.propic
    return PROPIC_PATH;
  }

  private _canConfirmChanges(): boolean {
    const original = this.user();
    const current = this.userForm.value;

    if (this.userForm.invalid) {
      this._showToast('Please fill all required fields correctly.', 'warning', 2000);
      return false;
    }

    if (this.verified()) {
      if (!current.name || !current.surname || !current.birthdate || !current.nationality) {
        this._showToast('Verified users must provide Name, Surname, Birthdate and Nationality.', 'danger', 2000);
        return false;
      }
    }

    // Verificare meglio quando avremo il backend
    if (this.selectedFile && this.selectedFile.size > 5 * 1024 * 1024) {
      this._showToast('The image is too large. Max 5MB allowed.', 'danger', 2000);
      return false;
    }

    const hasChanged = 
      current.username !== (original?.username ?? '') ||
      current.email !== (original?.email ?? '') ||
      Number(current.weight) !== Number(original?.weight) ||
      Number(current.height) !== Number(original?.height) ||
      current.name !== (original?.name ?? '') ||
      current.surname !== (original?.surname ?? '') ||
      current.birthdate !== (original?.birthdate ?? '') ||
      !this.compareNationalities(current.nationality, original?.nationality) || 
      this.selectedFile !== null || 

      (this.isPT() && (
        current.proemail !== (original?.pt?.proEmail ?? '') ||
        !this.compareGyms(current.gym, original?.pt?.gym) ||
        !this.compareCities(current.city, original?.pt?.city)
      ));

    if (!hasChanged) {
      // vedere se l'UX va bene
      this._showToast('No changes detected.', 'warning', 2000);
      return false;
    }

    return true;
  }

  async confirmChanges() {
    if (this.userForm.invalid) return;
    if (!this._canConfirmChanges()) return;
    const loading = await this.loadingController.create({
      message: "Wait a moment please..."
    });
    await loading.present();

    setTimeout(() => {
      loading.dismiss();
      this._showToast('Profile updated!', 'success', 250);
      setTimeout(() => {
        const updatedUser: User = this._prepareUserObject(this.userForm.value);
        this.authService.updateWithImage(updatedUser, this.selectedFile);
        this.selectedFile = null;
        this.router.navigate(["profile"]);
      }, 250);
    }, Math.random() * 2500 + 500);
  }

  private async _showToast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: duration,
    });
    await toast.present();
  }

  private _prepareUserObject(data: any): User {
    const user = this.user();
    if (!user) throw new Error("User not found");

    const cpy = structuredClone(user) as User;
    cpy.username = data.username;
    cpy.email = data.email;
    cpy.weight = data.weight;
    cpy.height = data.height;
    cpy.name = data.name;
    cpy.surname = data.surname;
    cpy.birthdate = data.birthdate;
    cpy.nationality = data.nationality;

    if (this.isPT()) {
      cpy.pt = {
        proEmail: data.proemail,
        city: data.city,
        gym: data.gym
      }
    }
    return cpy;
  }

  gymChanged(event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    const item = event.detail.value;
    if (item === "ADD_NEW") {
      this._addNewGym();
    }
  }

  private async _addNewGym() {
    const modal = await this.modalController.create({
      component: AddGymModalPage,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.gymService.new(data.name, data.address, data.lat, data.lng);
      this.gyms.push(data); 
      this.userForm.get('gym')?.setValue(data);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
}
