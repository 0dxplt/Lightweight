import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PersonalTrainerCard } from 'src/app/models/pt-card.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PtsService {
  private http = inject(HttpClient);

  ptsCity(city: string): Observable<PersonalTrainerCard[]> {
    return this.http.post<PersonalTrainerCard[]>(
      `${environment.apiUrl}/api/pts/from-city`,
      {city: city}
    ).pipe(
      map(rows => {
        return rows
      })
    );
  }
}
