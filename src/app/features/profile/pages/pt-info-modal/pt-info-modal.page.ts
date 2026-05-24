import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Gym } from 'src/app/models/gym.model';
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';
import * as L from 'leaflet';

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
  selector: 'app-pt-info-modal',
  templateUrl: './pt-info-modal.page.html',
  styleUrls: ['./pt-info-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PtInfoModalPage implements AfterViewInit, OnDestroy {

  @Input({required: true}) gym!: Gym;

  private map!: L.Map;

  constructor() {
    addIcons({locationOutline});
  }

  ngAfterViewInit(): void {
    this._initMap();
  }

  private async _initMap() {
    this.map = L.map('map-id');
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);
    
    const lat: number = this.gym.lat ?? 0;
    const lng: number = this.gym.lng ?? 0;
    
    this.map.setView([lat, lng], 16);
    this.createMaker(lat, lng);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

  createMaker(lat: number, lng: number) {
    L.marker([lat, lng]).addTo(this.map);
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }
}
