import { Injectable } from '@angular/core';
import { ValidationRequest } from 'src/app/models/request.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  requests(): ValidationRequest[] {
    const requests: ValidationRequest[] = [];
    for (let i = 0; i < 200; i++) {
      const request: ValidationRequest = {
        id: i+1,
        user: {
          id: i+1,
          username: "Requester#" + Math.round(Math.random() * 1000),
          email: "requester@prova",
          weight: 100,
          height: 180,
          followers: 0,
          following: 0,
          gLevel: 0,
          sLevel: 0,
          sxp: Math.round(Math.random() * 10000),
          gxp: Math.round(Math.random() * 10000),
          verified: (Math.random() < 0.5) ? true : false,
          sessions: Math.round(Math.random() * 300)
        },
        timestamp: Math.round(Math.random() * 100000000000)
      };
      requests.push(request);
    }
    return requests;
  }

  approve(request: ValidationRequest) {
    // query al db
    console.log("Approving request from user: \"" + request.user.username + "\"");
  }

  reject(request: ValidationRequest) {
    // query al db
    console.log("Rejecting request from user: \"" + request.user.username + "\"");
  }

  new(from: User | null) {
    if (!from) return;
    // query al db
    const request: ValidationRequest = {
      id: 999,
      user: from,
      timestamp: Date.now()
    }

    console.log("Adding new request with id: " + request.id + " from \"" + from.name + " " + from.surname + "\"");
  }
}
