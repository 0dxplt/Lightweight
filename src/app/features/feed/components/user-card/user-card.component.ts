import { Component, Input, OnInit } from '@angular/core';
import { IonChip, IonLabel, IonAvatar, IonIcon, IonCard } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { barbellOutline, logoIonic } from 'ionicons/icons';
import { SessionModalComponent } from "src/app/shared/components/session-modal/session-modal.component";

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  imports: [IonCard, IonIcon, IonChip, IonLabel, IonAvatar, SessionModalComponent],
})
export class UserCardComponent  implements OnInit {

  public isOpen = false;

  @Input({ required: true }) username!: string;
  @Input({ required: true }) sessionName!: string;
  @Input({ required: true }) gainedXP!: number;
  @Input({ required: true }) tags!: string[];
  @Input({ required: true }) avatarUrl!: string;
  @Input({ required: true }) verified!: boolean;
  @Input({ required: true }) pt!: boolean;

  constructor() {
    addIcons({ barbellOutline, logoIonic });
  }

  openModal() {
    this.isOpen=true;
  }

  ngOnInit() {}

}
