import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { City } from 'src/app/models/city.model';
import { Nation } from 'src/app/models/nation.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  
  constructor(private http: HttpClient) {}
  
  all(): Observable<City[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/cities/full`).pipe(
      map(data => data.map(city => ({
        id: city.id,
        name: city.nome,
        nation: city.nation
      })))
    );
  }
}
