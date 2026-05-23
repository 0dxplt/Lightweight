import { Component, inject, Input, OnInit } from '@angular/core';
import { ModalController, IonIcon, IonContent, IonTitle, IonToolbar, IonHeader, IonImg, IonFooter, IonChip } from '@ionic/angular/standalone';
import { IonButton } from "@ionic/angular/standalone";
import { Exercise } from 'src/app/models/exercise.model';
import { BetterMsViewerPipe } from "../../../../shared/pipes/better-ms-viewer-pipe";
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';

@Component({
  selector: 'app-exercise-modal',
  templateUrl: './exercise-modal.component.html',
  styleUrls: ['./exercise-modal.component.scss'],
  imports: [IonChip, IonFooter, IonImg, IonContent, IonIcon, IonButton, BetterMsViewerPipe],
})
export class ExerciseModalComponent  implements OnInit {

  private modalCtrl = inject(ModalController);
  @Input() exercise!: Exercise;

  public serie = 3;
  public ripetizioni = 10;
  public recuperoMs = 120000;

  constructor() { addIcons({starOutline, star})}

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss({serie:this.serie, ripetizioni:this.ripetizioni, recuperoMs:this.recuperoMs}, 'confirm');
  }

  modificaValore(attr: 'serie' | 'recuperoMs' | 'ripetizioni', value: number) {
    this[attr] += value;
    if (attr === 'recuperoMs') {
      if (this[attr] < 0) {
        this[attr] = 0;
      }
    } else {
      if (this[attr] < 1) {
      this[attr] = 1;
    }
    }
  }

  getStars(numero: number) {
    return new Array(numero).fill(0);
  }

}
