import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonModal, IonHeader, IonButtons, IonTitle, IonToolbar, IonContent, IonCard, ModalController, IonImg, IonChip } from "@ionic/angular/standalone";
import { SessionModalComponentInfo } from 'src/app/models/session-modal-component-info';

@Component({
  selector: 'app-session-modal',
  templateUrl: './session-modal.component.html',
  styleUrls: ['./session-modal.component.scss'],
  imports: [IonImg, IonContent, IonToolbar, IonTitle, IonButtons, IonHeader, IonButton, IonChip],
})
export class SessionModalComponent implements OnInit {

  @Input({ required: true }) sessionId!: number;

  private modalCtrl = inject(ModalController);
  public sessionInfo: SessionModalComponentInfo = {
    nome: "Fazzu Petto",
    timestamp: 1779189570,
    exercises: [
      {
        exercisePhotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
        nome: "Panca Piana",
        serie: [
          {
            peso: 37.5,
            reps: 8,
            recuperoMs: 3000
          },
          {
            peso: 37.5,
            reps: 8,
            recuperoMs: 3000
          },
          {
            peso: 37.5,
            reps: 8,
            recuperoMs: 3000
          },
          {
            peso: 37.5,
            reps: 8,
            recuperoMs: 3000
          }
        ],
        tags: [
          "Petto",
          "Tricipiti",
          "Spalle"
        ]
      },
      {
        exercisePhotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
        nome: "Panca Piana",
        serie: [
          {
            peso: 37.5,
            reps: 8,
            recuperoMs: 3000
          },
          {
            peso: 37.5,
            reps: 8,
            recuperoMs: 3000
          },
          {
            peso: 37.5,
            reps: 8,
            recuperoMs: 3000
          }
        ],
        tags: [
          "Petto",
          "Tricipiti",
          "Spalle",
        ]
      }
    ]
  };

  constructor() { }

  ngOnInit() {
    console.log("Modale aperto con Session ID:", this.sessionId);
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
