import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { IonButton, IonModal, IonHeader, IonButtons, IonTitle, IonToolbar, IonContent, IonCard, ModalController, IonImg, IonChip, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";
import { SessionModalComponentInfo } from 'src/app/models/session-modal-component-info';
import { BetterMsViewerPipe } from '../../pipes/better-ms-viewer-pipe';
import { addIcons } from 'ionicons';
import { statsChart } from 'ionicons/icons';
import { ChartModalComponent } from '../chart-modal/chart-modal.component';
import { SessionService } from '../../services/session-service';

@Component({
  selector: 'app-session-modal',
  templateUrl: './session-modal.component.html',
  styleUrls: ['./session-modal.component.scss'],
  imports: [IonIcon, IonFabButton, IonFab, IonImg, IonContent, IonToolbar, IonTitle, IonButtons, IonHeader, IonButton, IonChip, BetterMsViewerPipe],
})
export class SessionModalComponent implements OnInit {

  @Input({ required: true }) sessionId!: number;

  private modalCtrl = inject(ModalController);
  public sessionInfo = signal<SessionModalComponentInfo>({
    nome: "",
    timestamp: 0,
    exercises: []
  });
  private sessionService = inject(SessionService);

  constructor() {
    addIcons({ statsChart });
  }

  ngOnInit() {
    console.log("Modale aperto con Session ID:", this.sessionId);
    this.sessionService.get(9).subscribe({
      next: (data) => {
        console.log("Dati: ", data);
      },
      error: (err) => {
        console.log(err.message);
      }
    });
    this.sessionInfo.set(
      {
        nome: "Fazzu Petto",
        timestamp: 1779189570,
        exercises: [
          {
            exercisePhotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
            nome: "Panca Piana Manubri",
            serie: [
              {
                peso: 37.5,
                reps: 8,
                recuperoMs: 185000
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
              {
                nome: "Petto",
                perc: 55,
              },
              {
                nome: "Spalle",
                perc: 25,
              },
              {
                nome: "Tricipiti",
                perc: 20,
              }
            ]
          },
          {
            exercisePhotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
            nome: "Panca Inclinata",
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
              {
                nome: "Petto",
                perc: 55,
              },
              {
                nome: "Spalle",
                perc: 25,
              },
              {
                nome: "Tricipiti",
                perc: 20,
              }
            ]
          },
          {
            exercisePhotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
            nome: "Croci Macchinario",
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
              {
                nome: "Petto",
                perc: 55,
              },
              {
                nome: "Spalle",
                perc: 25,
              },
              {
                nome: "Bicipiti",
                perc: 20,
              }
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
              {
                nome: "Quadricipiti",
                perc: 55,
              },
              {
                nome: "Femorali",
                perc: 25,
              },
              {
                nome: "Addome",
                perc: 20,
              }
            ]
          }
        ]
      }
    )
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async openChartModal() {
    const modal = await this.modalCtrl.create({
      component: ChartModalComponent,
      initialBreakpoint: 0.53,
      breakpoints: [0, 0.53, 1.0],
      handle: true,
      componentProps: {
        exercises: (this.sessionInfo()) ? this.sessionInfo()!.exercises : [] 
      },
      cssClass: ''
    });

    await modal.present();
  }

}
