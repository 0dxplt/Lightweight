import { Component, inject, Input, OnInit } from '@angular/core';
import { IonChip, IonLabel, IonAvatar, IonIcon, IonCard, ModalController } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { barbellOutline, logoIonic } from 'ionicons/icons';
import { SessionModalComponent } from "src/app/shared/components/session-modal/session-modal.component";

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  imports: [IonCard, IonIcon, IonChip, IonLabel, IonAvatar],
})
export class UserCardComponent  implements OnInit {

  public isOpen = false;

  @Input({ required: true }) username!: string;
  @Input({ required: true }) sessionName!: string;
  @Input({ required: true }) sessionId!: number;
  @Input({ required: true }) gainedXP!: number;
  @Input({ required: true }) tags!: string[];
  @Input({ required: true }) avatarUrl!: string;
  @Input({ required: true }) verified!: boolean;
  @Input({ required: true }) pt!: boolean;

  private modalCtrl = inject(ModalController);

  constructor() {
    addIcons({ barbellOutline, logoIonic });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: SessionModalComponent,
      componentProps: {
        sessionId: this.sessionId  
      },
      cssClass: 'desktop-fullscreen'
    });
    
    await modal.present();
  }

  ngOnInit() {}

}
