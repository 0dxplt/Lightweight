import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, SelectChangeEventDetail } from '@ionic/angular';
import { CityService } from 'src/app/shared/services/city-service';
import { City } from 'src/app/models/city.model';
import { Gym } from 'src/app/models/gym.model';
import { GymService } from 'src/app/shared/services/gym-service';
import { IonSelectCustomEvent } from '@ionic/core';
import { AddGymModalPage } from '../add-gym-modal/add-gym-modal.page';

@Component({
  selector: 'app-pt-request-modal',
  templateUrl: './pt-request-modal.page.html',
  styleUrls: ['./pt-request-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class PtRequestModalPage implements OnInit {

  cities: City[] = this.cityService.all();
  gyms: Gym[] = this.gymService.all();

  ptFormGroup: FormGroup = new FormGroup({
    proemail: new FormControl('', [Validators.required, Validators.email]),
    gym: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required])
  });

  constructor(
    private cityService: CityService,
    private gymService: GymService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.cities = this.cityService.all();
    this.gyms = this.gymService.all();
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
      this.gymService.new(data.name, data.address, data.lat, data.lng);
      this.gyms.push(data); 
      this.ptFormGroup.get('gym')?.setValue(data);
    }
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalController.dismiss(this.ptFormGroup.value, 'confirm');
  }

}
