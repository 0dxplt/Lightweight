import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, SelectChangeEventDetail } from '@ionic/angular';
import { CityService } from 'src/app/shared/services/city-service';
import { City } from 'src/app/models/city.model';
import { Gym } from 'src/app/models/gym.model';
import { GymService } from 'src/app/shared/services/gym-service';
import { IonSelectCustomEvent } from '@ionic/core';
import { AddGymModalPage } from '../add-gym-modal/add-gym-modal.page';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pt-request-modal',
  templateUrl: './pt-request-modal.page.html',
  styleUrls: ['./pt-request-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class PtRequestModalPage implements OnInit {

  cities = signal<City[]>([]);
  gyms = signal<Gym[]>([]);

  ptFormGroup: FormGroup = new FormGroup({
    proemail: new FormControl('', [Validators.required, Validators.email]),
    gym: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required])
  });

  constructor(
    private cityService: CityService,
    private gymService: GymService,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cityService.all().subscribe(cities => {
      cities.forEach(c => {
        this.cities.update(value => {
          value.push(c);
          return value;
        });
      });
    })
    this.gymService.all().subscribe(gyms => {
      gyms.forEach(g => {
        this.gyms.update(value => {
          value.push(g);
          return value;
        })
      });
    });
  }

  onGymChange(event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    if (event.detail.value === 'ADD_NEW') {
      this.ptFormGroup.get('gym')?.setValue(null);
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
      this.gymService.new(data.name, data.address, data.lat, data.lng).subscribe({
        next: (res) => {
          this._showToast(res.message, 'success', 2000);
          this.gyms.update(value => {
            value.push(data);
            return value;
          }); 
          this.ptFormGroup.get('gym')?.setValue(data);
        },
        error: (err) => {
          this._showToast(err?.message ?? "Errore server", 'danger', 2000);
        }
      })
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
    return this.modalController.dismiss(this.ptFormGroup.value, 'confirm');
  }

}
