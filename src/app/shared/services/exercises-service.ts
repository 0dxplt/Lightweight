import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Exercise } from 'src/app/models/exercise.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExercisesService {
  private http = inject(HttpClient);

  full(): Observable<Exercise[]> {
    return this.http.get<{
      id_esercizio: number,
      nome_esercizio: string,
      descrizione: string,
      img: string | null,
      difficolta: number,
      gruppi_muscolari: string
    }[]>(environment.apiUrl + "/api/exercises/").pipe(
      map(rows => {
        return rows.map(row => {
          const muscles = JSON.parse(row.gruppi_muscolari);

          const muscularGroups = muscles.map((group: any) => ({
            perc: group.percentuale,
            muscolarGroup: {
              id: group.id,
              name: group.nome
            }
          }));

          return {
            id: row.id_esercizio,
            name: row.nome_esercizio,
            desc: row.descrizione,
            imgpath: (row.img) ? row.img : undefined,
            difficulty: row.difficolta,
            groups: muscularGroups
          }
        });
      }
      )
    );
  }
}
