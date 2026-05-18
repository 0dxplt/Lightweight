import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonModal, IonHeader, IonButtons, IonTitle, IonToolbar, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-session-modal',
  templateUrl: './session-modal.component.html',
  styleUrls: ['./session-modal.component.scss'],
  imports: [IonContent, IonToolbar, IonTitle, IonButtons, IonHeader, IonButton, IonModal],
})
export class SessionModalComponent  implements OnInit {

  @Input({ required: false }) isOpen!: boolean;
  @Output() isOpenChange = new EventEmitter<boolean>();

  setOpen(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  constructor() { }

  ngOnInit() {}

  onDidDismiss() {
    this.isOpenChange.emit(false);
  }

}
