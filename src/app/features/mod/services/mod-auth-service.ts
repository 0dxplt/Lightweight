import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Moderator } from 'src/app/models/moderator.model';

@Injectable({
  providedIn: 'root',
})
export class ModAuthService {
   
  private _moderator = signal<Moderator | null>(null);
  private _isLoggedIn = computed(() => this._moderator() !== null);
  moderator = this._moderator.asReadonly();

  constructor() {
    const savedUser = sessionStorage.getItem('moderator');
    this._moderator.set(savedUser ? JSON.parse(savedUser) : null);
  }

  login(username: string, email: string, password: string) {
    // fetch al DB
    // controlli sulla password
    const fakeMod: Moderator = {
      id:1,
      username: username,
      email: email
    }
    this._moderator.set(fakeMod);
    sessionStorage.setItem("moderator", JSON.stringify(fakeMod));
  }

  logout() {
    this._moderator.set(null);
    sessionStorage.removeItem('moderator');
  }
  
  isModLogged() {
    return this._isLoggedIn();
  }

  getModerator() {
    return this._moderator();
  }
}