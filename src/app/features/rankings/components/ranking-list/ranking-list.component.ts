import { Component, input, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { IonInfiniteScrollContent, IonInfiniteScroll, IonList, IonContent, IonRefresherContent, IonRefresher, RefresherEventDetail } from "@ionic/angular/standalone";
import { RankingEntryComponent } from '../ranking-entry/ranking-entry.component';
import { RankingService, RankUser } from '../../services/ranking-service';
import { RefresherCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html',
  styleUrls: ['./ranking-list.component.scss'],
  imports: [IonRefresher, IonRefresherContent, IonInfiniteScroll, RankingEntryComponent, IonList, IonInfiniteScrollContent, IonContent]
})
export class RankingListComponent  implements OnInit {

  readonly AVATAR_SERVER_PATH: string = "http://127.0.0.1:8000/uploads/avatars/";

  private _limit: number = 50;
  private _start: number = 0;
  private _users: RankUser[] = [];
  private _isLoading: boolean = false;
  
  filter = input<"global" | "seasonal">("global");
  users: RankUser[] = [];
  disabled: boolean = false;

  constructor(private service: RankingService) {}

  ngOnInit() {
    this.refresh();
  }

  private refresh() {
    this._users = this.service.getRankedUsers(this.filter() === "global");
    this.users = [];
    this._start = 0;
    this._addUsers();
  }

  private _addUsers() {
    const length = this._users.length;
    for (let i = 0; i < this._limit && this.users.length < length; i++, this._start++) {
      this.users.push(this._users[this._start]);
    }
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    if (this._users.length !== this.users.length) {
      if (this._isLoading) return;
      this._isLoading = true;
  
      setTimeout(() => {
        this._addUsers();
        this._isLoading = false;
        event.target.complete();
      }, 500);
    } else {
      this.disabled = true;
    }
  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.refresh();
      event.target.complete();
    }, 2000);
  }
}