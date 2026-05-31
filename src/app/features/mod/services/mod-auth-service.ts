import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Moderator } from 'src/app/models/moderator.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ModAuthService {
   
  private _moderator = signal<Moderator | null>(null);
  private _isLoggedIn = computed(() => this._moderator() !== null);
  moderator = this._moderator.asReadonly();

  constructor(private http: HttpClient) {
    const savedUser = sessionStorage.getItem('moderator');
    this._moderator.set(savedUser ? JSON.parse(savedUser) : null);
  }

  login(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/auth/mod-login`,
      {username: username, email: email, password: password}
    ).pipe(
      tap(response => {
        const moderator = response.moderator;
        this._moderator.set(moderator);
        sessionStorage.setItem("moderator", JSON.stringify(moderator));
        sessionStorage.setItem("jwt-token", response.token);
      })
    );
  }

  logout() {
    this._moderator.set(null);
    sessionStorage.clear();
  }
  
  isModLogged() {
    return this._isLoggedIn();
  }

  getModerator() {
    return this._moderator();
  }
}