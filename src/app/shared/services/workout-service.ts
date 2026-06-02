import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Exercise } from 'src/app/models/exercise.model';
import { WorkoutVisualization } from 'src/app/models/workout.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private http = inject(HttpClient);
  public workoutId = signal<number | null>(null);

  full(id_workout: number | null): Observable<WorkoutVisualization> {
    return this.http.post<{
      nome_workout: string,
      data_creazione: number,
      username: string,
      creatore_id: number,
      serie: number,
      ripetizioni: number,
      recupero: number,
      id_esercizio: number,
      nome_esercizio: string,
      descrizione: string,
      img: string | null,
      difficolta: number,
      gruppi_muscolari: string
    }[]>(environment.apiUrl + "/api/workout/",
      {id: id_workout}
    ).pipe(
      map(rows => {
        const workoutVisualization: WorkoutVisualization = {
          id: (id_workout) ? id_workout : -1,
          creatorUsername: rows[0].username,
          creatorId: rows[0].creatore_id,
          name: rows[0].nome_workout,
          creationTimestamp: rows[0].data_creazione,
          exercises: rows.map(row => {
            const muscles = JSON.parse(row.gruppi_muscolari);

            const muscularGroups = muscles.map((group: any) => ({
              perc: group.percentuale,
              muscolarGroup: {
                id: group.id,
                name: group.nome
              }
            }));

            const exercise: Exercise = {
              id: row.id_esercizio,
              name: row.nome_esercizio,
              desc: row.descrizione,
              imgpath: (row.img) ? row.img : undefined,
              difficulty: row.difficolta,
              groups: muscularGroups
            };

            return {
              serie: row.serie,
              reps: row.ripetizioni,
              recuperoMs: row.recupero,
              exercise: exercise,
              isExpanded: false
            }
          })
        };
        return workoutVisualization;
      })
    );
  }

  save(id: number, nome: string, data: number, creatore: number, exercises: {serie: number, ripetizioni: number, recupero: number, id: number}[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/api/workout/save/`,
      { id:id, nome: nome, data: data, creatore: creatore, exercises: exercises }
    );
  }

  delete(id: number | null): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/api/workout/delete/`,
      { id:id }
    );
  }
}
