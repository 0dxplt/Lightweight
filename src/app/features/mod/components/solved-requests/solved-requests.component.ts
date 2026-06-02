import { Component, OnInit, signal } from '@angular/core';
import { IonContent, IonRefresher, IonRefresherContent, IonList, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/angular/standalone";
import { SolvedService } from '../../services/solved-service';
import { SolvedRequest } from 'src/app/models/solved_request.model';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { SolvedRequestItemComponent } from "../solved-request-item/solved-request-item.component";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-solved-requests',
  templateUrl: './solved-requests.component.html',
  styleUrls: ['./solved-requests.component.scss'],
  imports: [IonContent, IonRefresher, IonRefresherContent, IonList, IonInfiniteScroll, IonInfiniteScrollContent, SolvedRequestItemComponent]
})
export class SolvedRequestsComponent  implements OnInit {
  private _solvedRequests = signal<SolvedRequest[]>([]);
  private _start: number = 0;
  private _limit = 50;
  private _isLoading: boolean = false;

  solvedRequests = signal<SolvedRequest[]>([]);
  disabled: boolean = false;

  constructor(
    private solvedService: SolvedService,
    private toastController: ToastController
  ) {}

    ngOnInit() {
      this._loadData();
    }

  private _loadData(event?: any) {
    this.solvedService.getSolvedRequests().subscribe({
      next: (requests) => {
        this._solvedRequests.set([...requests]);
        this.solvedRequests.set([]);
        this._start = 0;
        this.disabled = false;
        this._addSolvedRequests();
        if (event) event.target.complete();
        this._showToast("Solved Requests loaded succesfully!", 'success', 1000);
      },
      error: (err) => {
        this._showToast("Error: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
      }
    })
  }

  private async _showToast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: duration
    });
    await toast.present();
  }

  private _addSolvedRequests() {
    const all = this._solvedRequests();
    const currentVisible = this.solvedRequests();
    
    if (currentVisible.length >= all.length) {
      this.disabled = true;
      return;
    }

    const nextBatch = all.slice(this._start, this._start + this._limit);
    
    this.solvedRequests.update(prev => [...prev, ...nextBatch]);
    this._start += this._limit;
  }

  onIonInfinite(event: IonInfiniteScrollCustomEvent<void>) {
    if (this._solvedRequests.length !== this.solvedRequests.length) {
      if (this._isLoading) return;
      this._isLoading = true;
  
      setTimeout(() => {
        this._addSolvedRequests();
        this._isLoading = false;
        event.target.complete();
      }, 500);
    } else {
      this.disabled = true;
    }
  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    this._loadData(event);
  }
}
