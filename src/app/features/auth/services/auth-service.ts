import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type LoggedUser = {
  id: number;
  username: string;
  email: string;
  weight: number;
  height: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _user: BehaviorSubject<LoggedUser | null>;
  public user$: Observable<LoggedUser | null>;
  private _fakeIdCounter = 1;

  constructor() {
    const savedUser = localStorage.getItem('loggedUser');
    this._user = new BehaviorSubject<LoggedUser | null>(
      savedUser ? JSON.parse(savedUser) : null
    );

    this.user$ = this._user.asObservable();
  }

  login(email: string, password: string) {
    const fakeUser: LoggedUser = {
      id: this._fakeIdCounter,
      username: 'pippoesp69',
      email,
      weight: 190,
      height: 200
    };

    this._user.next(fakeUser);
    localStorage.setItem('loggedUser', JSON.stringify(fakeUser));
  }

  register(username: string, email: string, password: string, weight: number, height: number) {
    const newUser: LoggedUser = {
      id: ++this._fakeIdCounter,
      username,
      email,
      weight,
      height
    };

    this._user.next(newUser);
    localStorage.setItem('loggedUser', JSON.stringify(newUser));
  }

  logout() {
    this._user.next(null);
    localStorage.removeItem('loggedUser');
  }

  isLogged(): boolean {
    return this._user.value !== null;
  }

  getUser(): LoggedUser | null {
    return this._user.value;
  }
}