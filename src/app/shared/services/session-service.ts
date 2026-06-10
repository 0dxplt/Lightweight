import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap, timestamp } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { SessionExercise } from 'src/app/models/session-exercise.model';
import { SessionModalComponentInfo } from 'src/app/models/session-modal-component-info';
import { Session } from 'src/app/models/session.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  allOf(id: number): Observable<Session[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/sessions/${id}/full`);
  }

  updateSessionValidity(sessionId: number, sessionCreator: number, exercises: SessionExercise[]): Observable<{ updated: boolean }> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/moderators/update-session-validity`,
      { sessionId: sessionId, sessionCreator: sessionCreator, exercises: exercises }
    );
  }

  updateSessionVisibility(sessionId: number, visibility: boolean): Observable<{ updated: boolean }> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/profile/update-session-visibility`,
      { sessionId: sessionId, visibility: visibility, profileId: this.authService.user()?.id ?? -1 }
    );
  }

  updateSession(session: Session) {
    // query al DB
    console.log("Updating session: \"" + session.name + "\"");
  }

  removeSession(id: number | undefined): Observable<{ removed: boolean }> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/profile/remove-session`,
      { id: id, profileId: this.authService.user()?.id ?? -1 }
    );
  }

  get(id: number): Observable<any> {
    return this.http.get<{
      data_svolgimento: number,
      descrizione: string,
      gruppi_muscolari: string,
      id: number,
      img: string | null,
      nome: string,
      nome_sessione: string,
      serie: string,
      xp: number
    }[]>(`${environment.apiUrl}/api/sessions/` + id).pipe(
      map(rows => {
        const sessionData = rows[0];

        return {
          nome: sessionData.nome_sessione,
          timestamp: sessionData.data_svolgimento,
          exercises: rows.map(row => {
            const parsedSerie = row.serie ? JSON.parse(row.serie) : [];
            const parsedGruppi = row.gruppi_muscolari ? JSON.parse(row.gruppi_muscolari) : [];

            return {
              exercisePhotoUrl: row.img || "",
              nome: row.nome,
              serie: parsedSerie.map((s: any) => ({
                peso: s.peso,
                reps: s.reps,
                recuperoMs: s.recuperoMs
              })),
              tags: parsedGruppi.map((g: any) => ({
                nome: g.nome,
                perc: g.percentuale
              }))
            };
          }),
          xp: sessionData.xp
        };
      })
    );
  }
}
