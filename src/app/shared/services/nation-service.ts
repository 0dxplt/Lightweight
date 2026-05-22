import { Injectable } from '@angular/core';
import { Nation } from 'src/app/models/nation.model';

@Injectable({
  providedIn: 'root',
})
export class NationService {
  allNations(): Nation[] {
    const nations: Nation[] = [
      {
      id: 0,
      name: "Italia",
      shortform: "it-IT",
      flag: ""
    },
    {
      id: 1,
      name: "England",
      shortform: "en-EN",
      flag: ""
    },
    {
      id: 2,
      name: "Russia",
      shortform: "ru-RU",
      flag: ""
    }
    ];
    return nations;
  } 
}
