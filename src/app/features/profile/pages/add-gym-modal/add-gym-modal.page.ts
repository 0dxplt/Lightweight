import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import * as L from 'leaflet';
import { Gym } from 'src/app/models/gym.model';
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';
import { NationService } from 'src/app/shared/services/nation-service';
import { ToastController } from '@ionic/angular/standalone';

// Icone Leaflet (usa CDN)
const iconDefault = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-add-gym-modal',
  templateUrl: './add-gym-modal.page.html',
  styleUrls: ['./add-gym-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddGymModalPage implements AfterViewInit, OnDestroy {

  gymName: string = '';
  addressQuery: string = '';
  addressFound: string = '';
  cityFound: string = '';
  countryFound: string = '';

  lat: number | null = null;
  lng: number | null = null;

  private map!: L.Map;
  private marker!: L.Marker;

  constructor(
    private modalCtrl: ModalController,
    private nationService: NationService,
    private toastController: ToastController) {
    addIcons({locationOutline});
  }

  ngAfterViewInit() {
    this._initMap();
  }

  private _initMap() {
    // Inizializza su Italia
    this.map = L.map('map-id').setView([41.9028, 12.4964], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    // Click sulla mappa per posizionare il pin manualmente
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.updateMarker(e.latlng.lat, e.latlng.lng);
    });

    // Fix per caricamento corretto in modale Ionic
    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);
  }

  // Funzione per cercare un indirizzo
  async searchLocation() {
    if (!this.addressQuery || this.addressQuery.length < 3) return;

    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.addressQuery)}`
      );
      const results = await resp.json();

      if (results && results.length > 0) {
        const topResult = results[0];
        const lat = parseFloat(topResult.lat);
        const lng = parseFloat(topResult.lon);

        // Spostiamo la visuale
        this.map.setView([lat, lng], 16);
        
        // Chiamiamo updateMarker che penserà a mettere il pin e confermare l'indirizzo preciso
        this.updateMarker(lat, lng);
      }
    } catch (error) {
      console.error("Errore nella ricerca", error);
    }
  }

  // Aggiorna o crea il marker e recupera l'indirizzo
  private async updateMarker(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }

    // Reverse GeoCoding
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await resp.json();
      
      if (data && data.display_name) {
        const city =
          data.address.city ||
          data.address.town ||
          data.address.county;
        
        this.cityFound = city;
        this.countryFound = data.address.country;

        this.addressFound = data.display_name;
      } else {
        this.addressFound = `Coordinate: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      }
    } catch (error) {
      console.error("Errore nel recupero dell'indirizzo", error);
      this.addressFound = `Coordinate: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  }

  confirm() {
    if (!this.gymName || !this.lat) return;

    const newGym: Gym = {
      id: Math.floor(Math.random() * 10000),
      name: this.gymName,
      address: this.addressFound || 'Indirizzo selezionato da mappa',
      lat: this.lat,
      lng: this.lng || 0,
    };

    this.nationService.getByName(this.countryFound).subscribe({
      next: (nation) => {
        console.log(nation);
        this.modalCtrl.dismiss({
          gym: newGym,
          city: this.cityFound,
          nation: nation
        }, 'confirm');
      },
      error: (_) => {
        this._showToast("You can't choose this nation", 'danger');
      }
    });
  }

  private async _showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 2000
    });

    await toast.present();
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }
}