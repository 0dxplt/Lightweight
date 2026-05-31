import { Component, input, OnInit, signal } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { IonInfiniteScrollContent, IonInfiniteScroll, IonList, IonContent, IonRefresherContent, IonRefresher, RefresherEventDetail } from "@ionic/angular/standalone";
import { RankingEntryComponent } from '../ranking-entry/ranking-entry.component';
import { RankingService } from '../../services/ranking-service';
import { RefresherCustomEvent } from '@ionic/core';
import { RankUser } from 'src/app/models/rank-user.model';

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html',
  styleUrls: ['./ranking-list.component.scss'],
  imports: [IonRefresher, IonRefresherContent, IonInfiniteScroll, RankingEntryComponent, IonList, IonInfiniteScrollContent, IonContent]
})
export class RankingListComponent implements OnInit {
  private _limit: number = 20;
  private _start: number = 0;
  private _allUsers = signal<RankUser[]>([]);
  private _isLoading: boolean = false;
  
  filter = input<"global" | "seasonal">("global");
  disabled = false;
  users = signal<RankUser[]>([]);

  constructor(private service: RankingService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData(event?: any) {
    this.service.getRankedUsers(this.filter() === "global").subscribe({
      next: (res) => {
        this._allUsers.set(res);
        this._start = 0;
        this.users.set([]);
        this.disabled = false;
        this._addUsers();
        
        if (event) event.target.complete();
      },
      error: (err) => {
        console.error("Errore:", err);
        if (event) event.target.complete();
      }
    });
  }

  private _addUsers() {
    const all = this._allUsers();
    const currentVisible = this.users();
    
    if (currentVisible.length >= all.length) {
      this.disabled = true;
      return;
    }

    const nextBatch = all.slice(this._start, this._start + this._limit);
    
    this.users.update(prev => [...prev, ...nextBatch]);
    this._start += this._limit;
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    if (this._isLoading) return;

    this._isLoading = true;
    setTimeout(() => {
      this._addUsers();
      this._isLoading = false;
      event.target.complete();
    }, 500);
  }

  handleRefresh(event: RefresherCustomEvent) {
    this.loadData(event);
  }
}