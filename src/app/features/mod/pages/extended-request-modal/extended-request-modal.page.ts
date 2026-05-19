import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ValidationRequest } from 'src/app/models/request.model';
import { SolvedRequest } from 'src/app/models/solved_request.model';
import { addIcons } from 'ionicons';
import { calendarOutline, personOutline, shieldCheckmarkOutline, timeOutline } from 'ionicons/icons';
import { DatefyPipe } from "../../../../shared/pipes/datefy-pipe";
import { Router } from "@angular/router";

@Component({
  selector: 'app-extended-request-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, DatefyPipe],
  templateUrl: './extended-request-modal.page.html',
  styleUrls: ['./extended-request-modal.page.scss'],
})
export class ExtendedRequestModalPage implements OnInit {

  @Input() validationRequest: ValidationRequest | null = null;
  @Input() solvedRequest: SolvedRequest | null = null;
  @Input() solved: boolean = false;

  constructor(private modalController: ModalController, private router: Router) {}

  ngOnInit() {
    addIcons({personOutline, timeOutline, shieldCheckmarkOutline, calendarOutline});
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    })
  }

  goToProfileView(username: string | null | undefined) {
    if (!username) return;
    this.router.navigate(["mod/user-view/" + username]);
  }
}
