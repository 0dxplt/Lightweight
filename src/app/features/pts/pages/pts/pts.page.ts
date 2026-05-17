import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonSearchbar, IonList, IonItem, IonLabel, IonButton, IonModal, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { navigateOutline } from 'ionicons/icons';
import { PtCardComponent } from "../../components/pt-card/pt-card.component";
import { PersonalTrainerCard } from 'src/app/models/pt-card.model';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { HttpClient, provideHttpClient } from '@angular/common/http';
@Component({
  selector: 'app-pts',
  templateUrl: './pts.page.html',
  styleUrls: ['./pts.page.scss'],
  standalone: true,
  imports: [IonIcon, IonModal, IonButton, IonLabel, IonItem, IonList, IonSearchbar, IonContent, CommonModule, FormsModule, IonHeader, IonToolbar, PtCardComponent]

})
export class PtsPage implements OnInit {
  private http = inject(HttpClient);

  selectedCity = '';

  public filtered_pts: PersonalTrainerCard[] = [];
  public personal_trainers: PersonalTrainerCard[] = [
    {
      username: 'pippoesp',
      nome: 'Pippo Esposito',
      palestra: 'ASD GYM4U',
      eta: 24,
      fotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
      citta: "Erice"
    },
    {
      username: 'pippoesp',
      nome: 'Pippo Esposito',
      palestra: 'ASD GYM4U',
      eta: 19,
      fotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
      citta: "Erice"
    },
    {
      username: 'pippoesp',
      nome: 'Pippo Esposito',
      palestra: 'ASD GYM4U',
      eta: 19,
      fotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
      citta: "Erice"
    },
    {
      username: 'pippoesp',
      nome: 'Pippo Esposito',
      palestra: 'ASD GYM4U',
      eta: 19,
      fotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
      citta: "Trapani"
    },
    {
      username: 'pippoesp',
      nome: 'Pippo Esposito',
      palestra: 'ASD GYM4U',
      eta: 19,
      fotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
      citta: "Trapani"
    }
  ]

  public data = [
    'Amsterdam',
    'Buenos Aires',
    'Cairo',
    'Geneva',
    'Hong Kong',
    'Istanbul',
    'London',
    'Madrid',
    'New York',
    'Panama city',
    'Erice'
  ];
  public results = [...this.data];

  constructor() {
    addIcons({ navigateOutline });
  }

  ngOnInit() {
  }

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.results = this.data.filter((d) => d.toLowerCase().includes(query));
  }

  filterPts(city: string) {
    this.filtered_pts = this.personal_trainers.filter(pt => pt.citta === city);
  }

  selectCity(city: string, modal: any) {
    this.selectedCity = city;
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
      const urlApi = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=it`;

      this.http.get<any>(urlApi).subscribe({
        next: (risposta) => {
          this.selectedCity = risposta.city || risposta.locality || 'Città sconosciuta';
          this.filterPts(this.selectedCity);
        },
        error: (err) => {
          console.error('Errore durante il recupero della città:', err);
          this.selectedCity = 'Errore nel recupero';
        }
      });
    } catch (error) {
      console.error('Impossibile ottenere la posizione:', error);
    }
  }
}
