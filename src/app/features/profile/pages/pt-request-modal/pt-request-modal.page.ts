import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ModalController, SelectChangeEventDetail } from '@ionic/angular';
import { CityService } from 'src/app/shared/services/city-service';
import { City } from 'src/app/models/city.model';
import { Gym } from 'src/app/models/gym.model';
import { GymService } from 'src/app/shared/services/gym-service';
import { IonSelectCustomEvent } from '@ionic/core';
import { AddGymModalPage } from '../add-gym-modal/add-gym-modal.page';
import { ToastController } from '@ionic/angular/standalone';
import { Nation } from 'src/app/models/nation.model';
import { HttpClient } from '@angular/common/http';
import { GeoLocalizationService } from 'src/app/shared/services/geo-localization-service';

@Component({
  selector: 'app-pt-request-modal',
  templateUrl: './pt-request-modal.page.html',
  styleUrls: ['./pt-request-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class PtRequestModalPage implements OnInit {

  // cities = signal<City[]>([]);
  gyms = signal<Gym[]>([]);
  private _city = signal<City | null>(null);
  isCitySelected = computed(() => {
    return !!this._city();
  });

  ptFormGroup: FormGroup = new FormGroup({
    proemail: new FormControl('', [Validators.required, Validators.email]),
    gym: new FormControl('', [Validators.required]),
    // city: new FormControl('', [Validators.required])
  });

  customSelectFilter = {
    cssClass: 'modal-select-custom'
  };

  constructor(
    private cityService: CityService,
    private gymService: GymService,
    private geoService: GeoLocalizationService,
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    // this.cityService.all().subscribe(cities => {
    //   this.cities.set([...cities]);
    // })
    this.gymService.all().subscribe(gyms => {
      this.gyms.set([...gyms]);
    });
  }

  async onGymChange(event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    if (event.detail.value === 'ADD_NEW') {
      this.ptFormGroup.get('gym')?.setValue(null);
      this._addNewGym();
    } else {
      
      const loading = await this.loadingController.create({
        message: "Please wait..." 
      });
      await loading.present();

      const lat: number = event.detail.value.lat;
      const lng: number = event.detail.value.lng;
      this.geoService.getCityName(lat, lng).subscribe({
        next: (cityName) => {
          this.cityService.getByName(cityName).subscribe({
            next: (city) => {
              loading.dismiss();
              this._city.set(city);
            },
            error: (err) => {
              loading.dismiss();
              this._showToast("Error: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
            }
          });
        },
        error: (err) => {
          loading.dismiss();
          this._showToast("Error: " + (err.message), 'danger', 2000);
        }
      });
    }
  }

  private async _addNewGym() {
    const modal = await this.modalController.create({
      component: AddGymModalPage,
      cssClass: 'desktop-fullscreen'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      const nation: Nation = data.nation;
      const city = data.city;
      if (!city) {
        this._showToast("Couldn't retrieve gym's city", 'danger', 2000);
        return;
      }

      this.cityService.getOrInsert(city, nation).subscribe({
        next: (city) => {
          this._city.set(city);
          const newGym = data.gym;
          this.gymService.new(newGym.name, newGym.address, newGym.lat, newGym.lng).subscribe({
            next: (res) => {
              const __newGym = {
                ...newGym,
                id: res.gymId
              };
              this.gyms.update(value => [...value, __newGym]);
              this.ptFormGroup.get('gym')?.setValue(__newGym);
              this._showToast(res.message, 'success', 2000);
            },
            error: (err) => {
              this._showToast(err?.message ?? "Errore server", 'danger', 2000);
            }
          });
        },
        error: (err) => {
          this._showToast("Error: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
        }
      });
    }
  }

  private async _showToast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: duration
    });
    
    await toast.present();
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this._city) return;
    return this.modalController.dismiss({
      formValue: this.ptFormGroup.value,
      city: this._city()
    }, 'confirm');
  }

}
