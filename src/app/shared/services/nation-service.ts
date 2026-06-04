import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Nation } from 'src/app/models/nation.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NationService {

  constructor(private http: HttpClient) {}

  all(): Observable<Nation[]> {
    return this.http.get<any[]>(environment.apiUrl + "/api/nations").pipe(
      map(data => 
        data.map(nation => ({
          id: nation.id,
          name: nation.nome,
          shortform: nation.country_code,
          flag: nation.bandiera
        }))
      ));
  }

  getByName(name: string): Observable<Nation> {
    return this.http.get<Nation>(environment.apiUrl + "/api/nations/by-name/" + name);
  }
}
