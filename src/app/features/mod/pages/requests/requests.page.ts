import { Component, OnInit, signal } from '@angular/core';
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
import { ToastController } from '@ionic/angular/standalone';
import { UserService } from 'src/app/shared/services/user-service';
import { ModAuthService } from '../../services/mod-auth-service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RequestSlidingItemComponent, IonicModule]
})
export class RequestsPage implements OnInit {

  private _requests = signal<ValidationRequest[]>([]);
  private _start = 0;
  private _limit = 25;
  private _isLoading = false;
  
  requests = signal<ValidationRequest[]>([]);
  disabled: boolean = false;

  constructor(
    private modAuthService: ModAuthService,
    private requestService: RequestService,
    private userService: UserService,
    private location: Location,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    addIcons({'arrow-back':arrowBack});
  }

  ngOnInit() {
    this._loadData();
  }

  _loadData(event?: any) {
    this.requestService.requests().subscribe({
      next: (requests) => {
        this._requests.set([...requests]);
        this.requests.set([]);
        this._start = 0;
        this.disabled = false;
        this._addRequests();
        if (event) event.target.complete();
        this._showToast('Requests loaded correctly', 'success', 500);
      },
      error: (err) => {
        if (event) event.target.complete();
        this._showToast("Error: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
      }
    });
  }

  private async _showToast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: duration
    });
    await toast.present();
  }

  private _addRequests(){
    const all = this._requests();
    const currentVisible = this.requests();

    if (currentVisible.length >= all.length) {
      this.disabled = true;
      return;
    }

    const nextBatch = all.slice(this._start, this._start + this._limit);
    
    this.requests.update(prev => [...prev, ...nextBatch]);
    this._start += this._limit;
  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    this._loadData(event);
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

  approveRequest(request: ValidationRequest) {
    this.requestService.approve(this.modAuthService.moderator()?.id ?? -1, request).subscribe({
      next: (value) => {
        if (value.approved) {
          this._showToast("Request approved!", 'success', 1000);
        }
        this._loadData();
      },
      error: (err) => {
        this._showToast("Error: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
      }
    });
  }

  rejectRequest(request: ValidationRequest) {
    this.requestService.reject(this.modAuthService.moderator()?.id ?? -1,request).subscribe({
      next: (value) => {
        if (value.rejected) {
          this._showToast("Request Rejected!", 'success', 1000);
        }
        this._loadData();
      },
      error: (err) => {
        this._showToast("Error: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
      }
    });
  }
}
