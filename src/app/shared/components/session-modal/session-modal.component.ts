import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { IonButton, IonModal, IonHeader, IonButtons, IonTitle, IonToolbar, IonContent, IonCard, ModalController, IonImg, IonChip, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";
import { SessionModalComponentInfo } from 'src/app/models/session-modal-component-info';
import { BetterMsViewerPipe } from '../../pipes/better-ms-viewer-pipe';
import { addIcons } from 'ionicons';
import { flashOffOutline, flashOutline, statsChart } from 'ionicons/icons';
import { ChartModalComponent } from '../chart-modal/chart-modal.component';
import { SessionService } from '../../services/session-service';
import { DatefyPipe } from "../../pipes/datefy-pipe";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: 'app-session-modal',
  templateUrl: './session-modal.component.html',
  styleUrls: ['./session-modal.component.scss'],
  imports: [IonIcon, IonFabButton, IonFab, IonImg, IonContent, IonToolbar, IonTitle, IonHeader, IonButton, IonChip, BetterMsViewerPipe, DatefyPipe, DecimalPipe],
})
export class SessionModalComponent implements OnInit {

  @Input({ required: true }) sessionId!: number;

  private modalCtrl = inject(ModalController);
  public sessionInfo = signal<SessionModalComponentInfo>({
    nome: "",
    timestamp: 0,
    exercises: [],
    xp: 0
  });
  private sessionService = inject(SessionService);

  constructor() {
    addIcons({ statsChart, flashOutline });
  }

  ngOnInit() {
    this.sessionService.get(this.sessionId).subscribe({
      next: (data) => {
        this.sessionInfo.set(data);
      },
      error: (err) => {
        console.log(err.message);
      }
    });
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
