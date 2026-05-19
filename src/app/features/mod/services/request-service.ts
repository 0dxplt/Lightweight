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
          username: "Requester#" + Math.round(Math.random() * 1000)
        },
        timestamp: Math.round(Math.random() * 100000000000)
      };
      requests.push(request);
    }
    return requests;
  }
}
