import { Component, input, OnInit } from '@angular/core';
import { SolvedRequest } from 'src/app/models/solved_request.model';
import { DatefyPipe } from "../../../../shared/pipes/datefy-pipe";
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { ExtendedRequestModalPage } from '../../pages/extended-request-modal/extended-request-modal.page';
import { Router } from '@angular/router';
import { ModalController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-solved-request-item',
  templateUrl: './solved-request-item.component.html',
  styleUrls: ['./solved-request-item.component.scss'],
  imports: [DatefyPipe, IonicModule]
})
export class SolvedRequestItemComponent  implements OnInit {
  solvedRequest = input.required<SolvedRequest>();

  constructor(private router: Router, private modalController: ModalController) {
    addIcons({closeCircle, 'checkmark-circle':checkmarkCircle});
  }

  ngOnInit() {}

  get statusColor() {
    return this.solvedRequest().status === 'APPROVED'
      ? 'success'
      : 'danger';
  }

  get statusIcon() {
    return this.solvedRequest().status === 'APPROVED'
      ? 'checkmark-circle'
      : 'close-circle';
  }

  async openModal(request: SolvedRequest) {
    const modal = await this.modalController.create({
      component: ExtendedRequestModalPage,
      cssClass: 'extended-request-modal',
      initialBreakpoint: 0.4,
      breakpoints: [0, 0.4, 0.8, 1.0],
      handle: true,
      componentProps: {
        validationRequest: null,
        solvedRequest: request,
        solved: true
      }
    });

    await modal.present();
  }
}
