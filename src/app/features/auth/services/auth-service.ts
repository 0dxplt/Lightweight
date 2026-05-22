import { computed, Injectable, signal } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { SessionService } from 'src/app/shared/services/session-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _user = signal<User | null>(null);
  private _isLoggedIn = computed(() => this._user() !== null);
  
  user = this._user.asReadonly();
  private _fakeIdCounter = 1;
  
  constructor() {
    const savedUser = localStorage.getItem('loggedUser');
    this._user.set(savedUser ? JSON.parse(savedUser) : null);
  }

  login(email: string, password: string) {
    const fakeUser: User = {
      id: this._fakeIdCounter,
      username: 'pippoesp69',
      email,
      weight: 190,
      height: 200,
      followers: 0,
      following: 0,
      gLevel: 0,
      sLevel: 0,
      xp: 0,
      verified: false,
      sessions: Math.round(Math.random() * 300)
    };

    if (Math.random() < 0.5) {
      fakeUser.pt = {
        proEmail: fakeUser.username + "@proemail.com",
        gym: {
          id: 0,
          name: "PRO-GYM",
          address: "Piazza XXI Aprile, Trapani",
        },
        city: {
          id: 0,
          name: "Trapani",
          nation: {
            id: 0,
            name: "Italia",
            shortform: "it-IT",
            flag: ""
          }
        }
      }
    }

    this._user.set(fakeUser);
    localStorage.setItem('loggedUser', JSON.stringify(fakeUser));
  }

  register(username: string, email: string, password: string, weight: number, height: number) {
    const newUser: User = {
      id: ++this._fakeIdCounter,
      username,
      email,
      weight,
      height,
      followers: 0,
      following: 0,
      gLevel: 0,
      sLevel: 0,
      xp: 0,
      verified: false,
      sessions: Math.round(Math.random() * 300)
    };

    this._user.set(newUser);
    localStorage.setItem('loggedUser', JSON.stringify(newUser));
  }

  changePassword(oldPass: string, newPass: string) {
    // query al db
    console.log("Changed '" + oldPass + "' with + '" + newPass + "'");
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem('loggedUser');
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
}