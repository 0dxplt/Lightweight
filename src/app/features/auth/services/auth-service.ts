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
  private _fakeIdCounter = 1;

  public user$: Observable<LoggedUser | null>;
  
  constructor() {
    this._user = new BehaviorSubject<LoggedUser | null>(null);
    this.user$ = this._user.asObservable();
  }

  login(email: string, password: string) {
    const fakeUser: LoggedUser = {
      id: this._fakeIdCounter,
      username: 'pippoesp69',
      email: email,
      weight: 190,
      height: 200
    };
    this._user.next(fakeUser);
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
  }

  isLogged() : boolean {
    return this._user.value !== null;
  }

  logout() {
    this._user.next(null);
  }

  getUser() : LoggedUser | null {
    return this._user.value;
  }
}
