import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeoLocalizationService {
  
  constructor(private http: HttpClient) {}

  getCityAndNation(lat: number, lng: number): Observable<{cityName: string, nationName: string}> {
    return this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=it`).pipe(
      map(data => ({
        cityName: data.address.city || data.address.town || data.address.county || '',
        nationName: data.address.country || ''
      }))
    );
  }

  search(address: string): Observable<any[]> {
    return this.http.get<any[]>(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&accept-language=it`);
  }

  reverse(lat: number, lng: number): Observable<any> {
    return this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=it`);
  }
}
