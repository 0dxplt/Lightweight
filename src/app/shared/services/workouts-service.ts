import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { WorkoutMiniCard } from 'src/app/models/workout-mini-card.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkoutsService {
  private http = inject(HttpClient);

  get(): Observable<WorkoutMiniCard[]> {
    return this.http.get<{ workout_id: number, workout_nome: string, gruppi_muscolari: string}[]>(environment.apiUrl + "/api/workouts/").pipe(
      map(rows => {
        return rows.map(row => ({
          id: row.workout_id,
          nome: row.workout_nome,
          tags: JSON.parse(row.gruppi_muscolari)
        })
        );
      })
    );
  }
}
