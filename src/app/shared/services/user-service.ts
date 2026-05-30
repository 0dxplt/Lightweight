import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';

const names = ["Marco", "Giulia", "Luca", "Alessia", "Matteo", "Sofia", "Davide", "Chiara", "Simone", "Francesca"];
const surnames = ["Rossi", "Bianchi", "Verdi", "Russo", "Ferrari", "Esposito", "Romano", "Gallo", "Conti", "Costa"];

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
      gxp: Math.round(Math.random() * 100000),
      sxp: Math.round(Math.random() * 10000),
      followers: Math.round(Math.random() * 100000),
      following: Math.round(Math.random() * 100000),
      verified: (Math.random() < 0.5) ? true : false,
      nationality: {
        id: 2,
        name: 'Italia',
        shortform: 'it-IT',
        flag: ""
      },
      sessions: Math.round(Math.random() * 300)
    }
    return user;
  }

  updateVerified(user: User) {
    // Query al DB
    console.log("New Verified: " + user.verified); 
  }

  followersOf(username: string): User[] {
    // fetch al db
    const followers: User[] = [];

    for (let i = 1; i <= 25; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
      const username = (randomName + randomSurname + Math.floor(Math.random() * 100)).toLowerCase();

      const user: User = {
        id: i + 100,
        username: username,
        name: randomName,
        surname: randomSurname,
        email: `${username}@example.com`,
        birthdate: new Date(1970 + Math.floor(Math.random() * 35), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        weight: Math.round(50 + Math.random() * 50),
        height: Math.round(150 + Math.random() * 50),
        sLevel: Math.round(Math.random() * 50),
        gLevel: Math.round(Math.random() * 100),
        gxp: Math.round(Math.random() * 10000),
        sxp: Math.round(Math.random() * 10000),
        followers: Math.round(Math.random() * 1000),
        following: Math.round(Math.random() * 1000),
        sessions: Math.round(Math.random() * 200),
        verified: Math.random() > 0.8,
      };
      followers.push(user);
    }
    return followers;
  }

  followingOf(username: string) {
    // fetch al db
    const following: User[] = [];

    for (let i = 1; i <= 25; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
      const username = (randomName + randomSurname + Math.floor(Math.random() * 100)).toLowerCase();

      const user: User = {
        id: i + 100,
        username: username,
        name: randomName,
        surname: randomSurname,
        email: `${username}@example.com`,
        birthdate: new Date(1970 + Math.floor(Math.random() * 35), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        weight: Math.round(50 + Math.random() * 50),
        height: Math.round(150 + Math.random() * 50),
        sLevel: Math.round(Math.random() * 50),
        gLevel: Math.round(Math.random() * 100),
        sxp: Math.round(Math.random() * 10000),
        gxp: Math.round(Math.random() * 10000),
        followers: Math.round(Math.random() * 1000),
        following: Math.round(Math.random() * 1000),
        sessions: Math.round(Math.random() * 200),
        verified: Math.random() > 0.8,
      };
      following.push(user);
    }
    return following;
  }
}
