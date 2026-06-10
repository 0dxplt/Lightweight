import { Component, inject, Input, OnInit } from '@angular/core';
import { IonIcon, IonContent, IonImg, IonChip, IonFooter, IonButton, ModalController, IonHeader, IonToolbar } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { addCircleOutline, removeCircleOutline, star, starOutline } from 'ionicons/icons';
import { Exercise } from 'src/app/models/exercise.model';
import { BetterMsViewerPipe } from "../../../../shared/pipes/better-ms-viewer-pipe";

@Component({
  selector: 'app-session-exercise-modal',
  templateUrl: './session-exercise-modal.component.html',
  styleUrls: ['./session-exercise-modal.component.scss'],
  imports: [IonToolbar, IonHeader, IonButton, IonFooter, IonChip, IonImg, IonContent, IonIcon, BetterMsViewerPipe],
})
export class SessionExerciseModalComponent implements OnInit {

  private modalCtrl = inject(ModalController);
  @Input() exercise!: Exercise;
  @Input() reps!: number;
  @Input() recupero!: number;

  public peso = 0;
  public ripetizioni = 1;
  public recuperoMs = 1;

  constructor() { addIcons({ removeCircleOutline, addCircleOutline}) }

  ngOnInit() {
    this.peso = 15;
    this.ripetizioni = this.reps;
    this.recuperoMs = this.recupero;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss({ peso: this.peso, ripetizioni: this.ripetizioni, recuperoMs: this.recuperoMs }, 'confirm');
  }

  modificaValore(attr: 'peso' | 'recuperoMs' | 'ripetizioni', value: number) {
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
