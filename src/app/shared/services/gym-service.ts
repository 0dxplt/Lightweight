import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Gym } from 'src/app/models/gym.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GymService {

  constructor(private http: HttpClient) {}

  all(): Observable<Gym[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/gyms`).pipe(
      map(data => data.map(gym => ({
        id: gym.id,
        name: gym.nome,
        address: gym.indirizzo,
        lat: gym.lat,
        lng: gym.lng
      })))
    );
  }

  new(name: string, address: string, lat: number, lng: number): Observable<{message: string}> {
    return this.http.post<{message: string}>(
      `${environment.apiUrl}/api/gyms/new`,
      {name:name, address:address, lat:lat, lng:lng}
    );
  }
}
