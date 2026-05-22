import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user(username: string): User {
    // Fetch al DB
    const user: User = {
      id: Math.round(Math.random() * 1000),
      username: username,
      email: username + "@prova.com",
      weight: Math.round(Math.random() * 120) + 30,
      height: Math.round(Math.random() * 120) + 40,
      sLevel: Math.round(Math.random() * 1000),
      gLevel: Math.round(Math.random() * 1000),
      xp: Math.round(Math.random() * 100000),
      followers: Math.round(Math.random() * 100000),
      following: Math.round(Math.random() * 100000),
      verified: (Math.random() < 0.5) ? true : false,
      nationality: {
        id: 2,
        name: 'Italia',
        shortform: 'it-IT',
        flag: ""
      }
    }
    return user;
  }

  updateVerified(user: User) {
    // Query al DB
    console.log("New Verified: " + user.verified); 
  }
}
