import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeoLocalizationService {
  
  constructor(private http: HttpClient) {}

  getCityName(lat: number, lng: number): Observable<string> {
    return this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`).pipe(
      map(data => data.address.city || data.address.town || data.address.county || '')
    );
  }

  search(address: string): Observable<any[]> {
    return this.http.get<any[]>(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  }

  reverse(lat: number, lng: number): Observable<any> {
    return this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
  }
}
