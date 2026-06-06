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
    return this.http.post<any[]>(
      `${environment.apiUrl}/api/pts/from-city`,
      {city: city}
    ).pipe(
      map(rows => rows.map(row => ({
        username: row.username,
        nome: row.nome,
        cognome: row.cognome,
        palestra: row.palestra,
        eta: row.eta,
        citta: row.citta,
        fotoUrl: !!row.fotoUrl ? `${environment.apiUrl}/api/imgs/users?id=${row.id}&timestamp=${Date.now()}` : '/assets/icon/favicon.png'
      })))
    );
  }
}
