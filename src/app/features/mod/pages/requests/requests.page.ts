import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { ValidationRequest } from 'src/app/models/request.model';
import { RequestService } from '../../services/request-service';
import { RequestSlidingItemComponent } from '../../components/request-sliding-item/request-sliding-item.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { ExtendedRequestModalPage } from '../extended-request-modal/extended-request-modal.page';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RequestSlidingItemComponent, IonicModule]
})
export class RequestsPage implements OnInit {

  private _requests: ValidationRequest[] = [];
  private _start = 0;
  private _limit = 25;
  private _isLoading = false;
  
  requests: ValidationRequest[] = [];
  disabled: boolean = false;


  constructor(
    private requestService: RequestService,
    private location: Location,
    private modalController: ModalController
  ) {}

  refresh() {
    this._requests = this.requestService.requests();
    this.requests = [];
    this._start = 0;
    this._addRequests();
  }

  private _addRequests(){
    const length = this._requests.length;
    for (let i = 0; i < this._limit && this.requests.length < length; i++) {
      this.requests.push(this._requests[this._start++]);
    }
  }

  ngOnInit() {
    addIcons({'arrow-back':arrowBack});
    this.refresh();
  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      this.refresh();
      event.target.complete();
    }, 2000);
  }

  onIonInfinite(event: IonInfiniteScrollCustomEvent<void>) {
    if (this._requests.length !== this.requests.length) {
      if (this._isLoading) return;
      this._isLoading = true;
  
      setTimeout(() => {
        this._addRequests();
        this._isLoading = false;
        event.target.complete();
      }, 500);
    } else {
      this.disabled = true;
    }
  }

  goBack() {
    this.location.back();
  }

  async openModal(request: ValidationRequest) {
    const modal = await this.modalController.create({
      component: ExtendedRequestModalPage,
      cssClass: 'extended-request-modal',
      initialBreakpoint: 0.4,
      breakpoints: [0, 0.4, 0.8, 1.0],
      handle: true,
      componentProps: {
        validationRequest: request,
        solvedRequest: null,
        solved: false
      }
    });

    await modal.present();
  }
}
