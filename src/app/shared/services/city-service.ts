import { Injectable } from '@angular/core';
import { City } from 'src/app/models/city.model';
import { Nation } from 'src/app/models/nation.model';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  all(): City[] {
    const nation: Nation = {
      id: 0,
      name: "Italy",
      shortform: "it-IT",
      flag: ""
    };

    const cities: City[] = [
      {
        id: 0,
        name: "Trapani",
        nation: nation
      },
      {
        id: 1,
        name: "Palermo",
        nation: nation
      },
      {
        id: 2,
        name: "Napoli",
        nation: nation
      }
    ];

    return cities;
  }
}
