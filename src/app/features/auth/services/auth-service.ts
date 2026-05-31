import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CurrentSession } from 'src/app/models/current-session.model';
import { SessionExercise } from 'src/app/models/session-modal-component-info';
import { SaveSession } from 'src/app/models/session.model';
import { User } from 'src/app/models/user.model';
import { Workout, WorkoutVisualization } from 'src/app/models/workout.model';
import { GLOBAL_RANK_UP } from 'src/app/shared/global';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _user = signal<User | null>(null);
  private _isLoggedIn = computed(() => this._user() !== null);

  user = this._user.asReadonly();

  private _currentSession = signal<CurrentSession | null>(null);

  currentSession = this._currentSession.asReadonly();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('loggedUser');
    this._user.set(savedUser ? JSON.parse(savedUser) : null);
    const currentSession = localStorage.getItem('currentSession');
    this._currentSession.set(currentSession ? JSON.parse(currentSession) : null);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/auth/login`,
      { email: email, password: password }
    ).pipe(
      tap(response => {
        const resUser = response.user;
        const loggedUser: User = {
          id: resUser.id,
          username: resUser.username,
          email: resUser.email,
          weight: resUser.weight,
          height: resUser.height,
          sLevel: resUser.livello_stagionale,
          gLevel: resUser.livello_globale,
          sxp: resUser.xp_stagionali,
          gxp: resUser.xp_globali,
          followers: resUser.numero_followers,
          following: resUser.numero_followed,
          sessions: resUser.numero_sessioni,
          verified: resUser.verificato === 0 ? false : true,
          name: !resUser.nome ? undefined : resUser.nome,
          surname: !resUser.cognome ? undefined : resUser.cognome,
          nationality: !resUser.nazione ? undefined : resUser.nazione,
          birthdate: !resUser.data_nascita ? undefined : resUser.data_nascita,
          propic: !resUser.img ? undefined : environment.apiUrl + "/api/imgs/users?id=" + resUser.id,
          pt: !resUser.pt ? undefined : resUser.pt
        };
        this._user.set(loggedUser);
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        localStorage.setItem('jwt-token', response.token);
      })
    );
  }

  register(username: string, email: string, password: string, weight: number, height: number): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/auth/register`,
      { username: username, email: email, password: password, weight: weight, height: height }
    );
  }

  changePassword(oldPass: string, newPass: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/profile/change-password`,
      {oldPass: oldPass, newPass: newPass, profileId: this._user()?.id ?? -1}
    );
  }

  logout() {
    this._user.set(null);
    this._currentSession.set(null);
    localStorage.clear();
  }

  isLogged(): boolean {
    return this._isLoggedIn();
  }

  getUser(): User | null {
    return this._user();
  }

  update(user: User, propic: File | null): Observable<User> {
    const formData = new FormData();
    
    formData.append('user', JSON.stringify(user));
    formData.append('profileId', (this._user()?.id ?? -1).toString());
    
    if (propic) {
      formData.append('propic', propic);
    }

    return this.http.post<any>(
      `${environment.apiUrl}/api/profile/update`,
      formData
    ).pipe(
      tap(resUser => {
        if (resUser.propic) {
          resUser.propic = `${resUser.propic}&t=${new Date().getTime()}`;
        }
        console.log(resUser);
        this._user.set(resUser);
        localStorage.setItem('loggedUser', JSON.stringify(this._user()));
      })
    );
  }

  updateWithImage(user: User, propic: File | null) {
    // const formData = new FormData();
    // formData.append('user', JSON.stringify(user));
    // if (propic) {
    //   formData.append('propic', propic, propic.name);
    // }
    // query al db
    this._user.set(user);
    localStorage.setItem('loggedUser', JSON.stringify(this._user()));
  }

  follows(other: number): Observable<boolean> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/profile/follows`,
      {profileId: (this.user()?.id ?? -1), otherId: other}
    );
  }

  follow(otherId: number, toBeFollowed: WritableSignal<User | null>): Observable<{followed: boolean}> {
    return this.http.get<any>(`${environment.apiUrl}/api/users/${this.user()?.id ?? -1}/follow/${otherId}`).pipe(
      tap(data => {
        if (data.followed) {
          this._user.update(u => {
            if (!u) return u;
            u.following++;
            return u;
          });
          localStorage.setItem('loggedUser', JSON.stringify(this._user()));
          toBeFollowed.update(u => {
            if (!u) return u;
            u.followers++;
            return u;
          });
        }
      })
    );
  }

  unfollow(otherId: number, toBeUnfollowed: WritableSignal<User | null>): Observable<{unfollowed: boolean}> {
    return this.http.get<any>(`${environment.apiUrl}/api/users/${this.user()?.id ?? -1}/unfollow/${otherId}`).pipe(
      tap(data => {
        if (data.unfollowed) {
          this._user.update(u => {
            if (!u) return u;
            u.following--;
            return u;
          });
          localStorage.setItem('loggedUser', JSON.stringify(this._user()));
          toBeUnfollowed.update(u => {
            if (!u) return u;
            u.followers--;
            return u;
          });
        }
      })
    );
  }

  createCurrentSession(workout: WorkoutVisualization) {
    this._currentSession.set({
      nome: workout.name,
      workout: workout,
      exercises: []
    });
    localStorage.setItem('currentSession', JSON.stringify(this._currentSession()));
  }

  updateCurrentSession(nome: string,
    workout: WorkoutVisualization,
    exercises: SessionExercise[]) {
    this._currentSession.set({
      nome: nome,
      workout: workout,
      exercises: exercises
    });
    localStorage.setItem('currentSession', JSON.stringify(this._currentSession()));
  }

  finishCurrentSession(session: SaveSession) {
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/api/workout/save/`, // TODO: da sistemare
      session
    ).pipe(
      tap((res) => {
        console.log(res.message)
        this._currentSession.set(null);
        localStorage.removeItem('currentSession');
      })
    )
  }
}