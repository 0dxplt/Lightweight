import { Injectable } from '@angular/core';
import { Exercise } from 'src/app/models/exercise.model';
import { Session } from 'src/app/models/session.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  allOf(username: string): Session[] {
    // fetch al db
    const sessions: Session[] = [];
    for (let i = 0; i < 25; i++) {
      const user: User =  {
        id: i+1,
        username: username,
        email: "user@prova",
        sessions: Math.round(Math.random() * 300),
        weight: 100,
        height: 180,
        followers: 0,
        following: 0,
        gLevel: 0,
        sLevel: 0,
        gxp: Math.round(Math.random() * 1000),
        sxp: Math.round(Math.random() * 10000),
        verified: (Math.random() < 0.5) ? true : false
      }
      const exercise: Exercise = {
        id: 2,
        name: "Curls",
        desc: "Yes",
        groups: [{
          muscolarGroup: {
            id: 0,
            name: "Biceps"
          },
          perc: 0.60
        },
        {
          muscolarGroup: {
            id: 1,
            name: "Forearms"
          },
          perc: 0.20
        },
        {
          muscolarGroup: {
            id: 0,
            name: "Chest"
          },
          perc: 0.20
        }],
        difficulty: 0.5
      }
      const session: Session = {
        id: i+1,
        user: user,
        timestamp: Math.round(Math.random() * 100000000000),
        shared: (Math.random() < 0.5) ? true : false,
        workout: {
          id: i + 1,
          creator: user,
          name: user.username + "'s workout#" + (i+1),
          creationTimestamp: Math.round(Math.random() * 100000000000),
          exercises: [{
            id: 0,
            reps: 12,
            series: 3,
            exercise: exercise
          }]
        },
        exercises: [{
          id: 0,
          reps: 12,
          valid: true,
          weight: 20,
          exercise: exercise,
          recovery: 3000
        },
        {
          id: 0,
          reps: 20,
          valid: true,
          weight: 14,
          exercise: exercise,
          recovery: 3000
        },
        {
          id: 0,
          reps: 12,
          valid: true,
          weight: 18,
          exercise: exercise,
          recovery: 3000
        },
      {
          id: 0,
          reps: 12,
          valid: true,
          weight: 18,
          recovery: 3000,
          exercise: {
            name: "Chest Press",
            id: i+1,
            desc: "Of course",
            difficulty: 0.4,
            groups: [{
              muscolarGroup: {
                id: i+1,
                name: "Chest"
              },
              perc: 1
            }]
          }
        }],
        xp: Math.round(Math.random() * 1000)
      }
      sessions.push(session);
    }
    return sessions;
  }

  updateSession(session: Session) {
    // query al DB
    console.log("Updating session: \"" + session.workout.name + "\"");
  }

  removeFrom(username: string | undefined, id: number | undefined) {
    if (!username || !id) return;
    // query al db
    console.log("Deleting session #" + id + " from user \"" + username + "\"");
  }
}