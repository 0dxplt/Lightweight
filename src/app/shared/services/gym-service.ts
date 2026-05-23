import { Injectable } from '@angular/core';
import { Gym } from 'src/app/models/gym.model';

@Injectable({
  providedIn: 'root',
})
export class GymService {
  all(): Gym[] {
    const gyms: Gym[] = [
      {
        id: 0,
        name: "GymFit",
        address: "Via..."
      },
      {
        id: 1,
        name: "UP&DOWN",
        address: "He bella hosa"
      },
      {
        id: 2,
        name: "Gymnasium",
        address: "Via della Pace"
      },
      {
        id: 3,
        name: "PeppeEsp60 AS",
        address: "Yeah buddy"
      }
    ];
    return gyms;
  }

  new(name: string, address: string, lat: number, lng: number) {
    // query al db
    const gym: Gym = {
      id: Math.round(Math.random() * 2000),
      name: name,
      address: address,
      lat: lat,
      lng: lng
    };

    console.log("Adding new Gym: " + gym.name + "(" + gym.address + ")");
  }
}
