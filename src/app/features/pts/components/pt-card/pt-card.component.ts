import { Component, Input, OnInit } from '@angular/core';
import { IonCard, IonImg } from "@ionic/angular/standalone";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pt-card',
  templateUrl: './pt-card.component.html',
  styleUrls: ['./pt-card.component.scss'],
  imports: [IonImg, IonCard, RouterLink],
})
export class PtCardComponent  implements OnInit {

  @Input({ required: true }) fotoUrl!: string;
  @Input({ required: true }) username!: string;
  @Input({ required: false }) nome!: string;
  @Input({ required: true }) palestra!: string;
  @Input({ required: false }) eta!: number;

  constructor() { }

  ngOnInit() {}

}
