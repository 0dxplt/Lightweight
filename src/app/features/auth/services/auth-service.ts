import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CurrentSession } from 'src/app/models/current-session.model';
import { SessionExercise } from 'src/app/models/session-modal-component-info';
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
  private _fakeIdCounter = 1;

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
      {email:email, password:password}
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
      {username: username, email:email, password:password, weight: weight, height: height}
    );
  }

  changePassword(oldPass: string, newPass: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/users/change-password`,
      {oldPass: oldPass, newPass: newPass}
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

  update(user: User) {
    // query al db
    this._user.set(user);
    localStorage.setItem('loggedUser', JSON.stringify(this._user()));
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

  follows(otherUsername: string): boolean {
    if (otherUsername === this._user()?.username) false;
    // fetch al DB
    const follows: boolean = true;
    return follows;
  }

  follow(otherUsername: string, toBeFollowed: WritableSignal<User | null>) {
    if (otherUsername === this._user()?.username) return;
    // query al db

    if (!this._user()) return;

    const cpy = structuredClone(this.user()) as User;
    cpy.following++;
    this._user.set(cpy);
    localStorage.setItem('loggedUser', JSON.stringify(this._user()));
    console.log(this._user()?.username + ' has followed ' + otherUsername);

    const other = toBeFollowed();
    if (!other) return;
    other.followers++;
    toBeFollowed.set(other);
  }

  unfollow(otherUsername: string, toBeUnfollowed: WritableSignal<User | null>) {
    if (otherUsername === this._user()?.username) return;
    // query al db

    if (!this._user()) return;

    const cpy = structuredClone(this.user()) as User;
    cpy.following--;
    this._user.set(cpy);
    localStorage.setItem('loggedUser', JSON.stringify(this._user()));
    console.log(this._user()?.username + ' has unfollowed ' + otherUsername);

    const other = toBeUnfollowed();
    if (!other) return;
    other.followers--;
    toBeUnfollowed.set(other);
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

  finishCurrentSession() {
    this._currentSession.set(null);
    localStorage.removeItem('currentSession');
  }
}