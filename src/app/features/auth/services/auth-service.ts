import { computed, Injectable, signal } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { GLOBAL_RANK_UP } from 'src/app/shared/global';

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
      followers: 1000,
      following: 1000,
      gLevel: 69,
      sLevel: 33,
      xp: Math.round(0.4 * GLOBAL_RANK_UP),
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
      followers: 500,
      following: 500,
      gLevel: 69,
      sLevel: 33,
      xp: Math.round(0.4 * GLOBAL_RANK_UP),
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

  follow(otherUsername: string) {
    if (otherUsername === this._user()?.username) return;
    // query al db

    if (!this._user()) return;

    const other = structuredClone(this.user()) as User;
    other.followers++;
    this._user.set(other);
    localStorage.setItem('loggedUser', JSON.stringify(this._user()));

    console.log(this._user()?.username + ' has followed ' + otherUsername);
  }
  
  unfollow(otherUsername: string) {
    if (otherUsername === this._user()?.username) return;
    // query al db

    if (!this._user()) return;

    const other = structuredClone(this.user()) as User;
    other.followers--;
    this._user.set(other);
    localStorage.setItem('loggedUser', JSON.stringify(this._user()));

    console.log(this._user()?.username + ' has unfollowed ' + otherUsername);
  }
}