import { Component, OnInit } from '@angular/core';
import { IonContent, IonRefresher, IonRefresherContent, IonList, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/angular/standalone";
import { SolvedService } from '../../services/solved-service';
import { SolvedRequest } from 'src/app/models/solved_request.model';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { SolvedRequestItemComponent } from "../solved-request-item/solved-request-item.component";

@Component({
  selector: 'app-solved-requests',
  templateUrl: './solved-requests.component.html',
  styleUrls: ['./solved-requests.component.scss'],
  imports: [IonContent, IonRefresher, IonRefresherContent, IonList, IonInfiniteScroll, IonInfiniteScrollContent, SolvedRequestItemComponent]
})
export class SolvedRequestsComponent  implements OnInit {
  private _solvedRequests: SolvedRequest[] = [];
  private _start: number = 0;
  private _limit = 50;
  private _isLoading: boolean = false;

  solvedRequests: SolvedRequest[] = [];
  disabled: boolean = false;

  constructor(private solvedService: SolvedService) {}

  private refresh() {
    this._solvedRequests = this.solvedService.getSolvedRequests();
    this.solvedRequests = [];
    this._start = 0;
    this._addSolvedRequests();
  }

  ngOnInit() {
    this.refresh();
  }

  private _addSolvedRequests() {
    const length = this._solvedRequests.length;
    for (let i = 0; i < this._limit && this.solvedRequests.length < length; i++) {
      this.solvedRequests.push(this._solvedRequests[this._start++]);
    }
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
    setTimeout(() => {
      this.refresh();
      event.target.complete();
    }, 2000);
  }
}
