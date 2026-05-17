import { Injectable } from '@angular/core';

export type RankUser = {
  rank: number;
  avatar: string;
  username: string;
  pt: boolean;
  level: number;
}

@Injectable({
  providedIn: 'root',
})
export class RankingService {
  readonly SIZE_LIMIT: number = 200;
  
  getRankedUsers(global: boolean): RankUser[] {
    let users: RankUser[] = [];
    let filter: string = (global) ? "global" : "seasonal";
    if (global) {
      // fetch con filter=global
    } else {
      // fetch con filter=seasonal
    }
    for (let i = 0; i < this.SIZE_LIMIT; i++) {
      const user: RankUser = {
          rank: 0,
          avatar: "http://localhost:8000/uploads/avatars/" + 'pippoesp69.png',
          username: 'pippoesp69#'+i,
          pt: (Math.random() < 0.5) ? true : false,
          level: Math.round((Math.random() * 1000))
        }
        users.push(user);
    }
    users = users.sort((a, b) => b.level - a.level);
    for (let i = 0; i < users.length; i++) {
      users[i].rank = i+1;
    }
    return users;
  }
}