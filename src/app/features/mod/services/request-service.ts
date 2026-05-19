import { Injectable } from '@angular/core';
import { ValidationRequest } from 'src/app/models/request.model';

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
          xp: 0,
          verified: (Math.random() < 0.5) ? true : false
        },
        timestamp: Math.round(Math.random() * 100000000000)
      };
      requests.push(request);
    }
    return requests;
  }
}
