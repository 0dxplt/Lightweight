import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MuscolarGroupsService {
  private http = inject(HttpClient);

  all():Observable<string[]> {
    return this.http.get<{nome: string}[]>(environment.apiUrl + "/api/muscolar-groups/").pipe(
      map(rows => {
        return rows.map(row => row.nome);
      })
    )
  }
}
