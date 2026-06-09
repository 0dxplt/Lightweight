import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonSearchbar, IonList, IonItem, IonLabel, IonButton, IonModal, IonIcon, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { navigateOutline } from 'ionicons/icons';
import { PtCardComponent } from "../../components/pt-card/pt-card.component";
import { PersonalTrainerCard } from 'src/app/models/pt-card.model';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { CityMinimal } from 'src/app/models/city.model';
import { CityService } from 'src/app/shared/services/city-service';
import { PtsService } from 'src/app/shared/services/pts-service';
import { GeoLocalizationService } from 'src/app/shared/services/geo-localization-service';
@Component({
  selector: 'app-pts',
  templateUrl: './pts.page.html',
  styleUrls: ['./pts.page.scss'],
  standalone: true,
  imports: [IonAvatar, IonIcon, IonModal, IonButton, IonLabel, IonList, IonSearchbar, IonContent, CommonModule, FormsModule, IonHeader, IonToolbar, PtCardComponent]

})
export class PtsPage implements OnInit {

  private cityService = inject(CityService);

  private ptsService = inject(PtsService);

  private geoService = inject(GeoLocalizationService);

  public selectedCity = signal<string>("");

  public personal_trainers = signal<PersonalTrainerCard[]>([]);

  public cities = signal<CityMinimal[]>([])

  public results: CityMinimal[] = [];

  constructor() {
    addIcons({ navigateOutline });
  }

  ngOnInit() {
    this.cityService.allMinimal().subscribe({
      next: (data) => {
        this.cities.set(data);
        this.results = (this.cities()) ? [...this.cities()] : [];
      },
      error: (err) => {
        console.log("Errore nel caricare le città");
      }
    })
  }

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.results = this.cities().filter((d) => d.nome.toLowerCase().includes(query));
  }

  filterPts(city: string) {
    this.ptsService.ptsCity(city).subscribe({
      next: (data) => {
        this.personal_trainers.set(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  selectCity(city: string, modal: any) {
    this.selectedCity.set(city);
    modal.dismiss();
    this.filterPts(city);
  }

  async getCity() {
    try {
      const opzioni: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      const posizione = await Geolocation.getCurrentPosition(opzioni);
      const lat = posizione.coords.latitude;
      const lng = posizione.coords.longitude;

      this.geoService.getCityName(lat, lng).subscribe({
        next: (city) => {
          this.selectedCity.set(city);
          this.filterPts(this.selectedCity());
        },
        error: (err) => {
          console.error('Errore durante il recupero della città:', err);
          this.selectedCity.set("");
        }
      });
    } catch (error) {
      console.error('Impossibile ottenere la posizione:', error);
    }
  }
}
