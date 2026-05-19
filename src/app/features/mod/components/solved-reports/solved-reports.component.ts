import { Component, OnInit } from '@angular/core';
import { SolvedService } from '../../services/solved-service';
import { IonContent, IonRefresher, IonRefresherContent, IonList, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/angular/standalone";
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { SolvedReportItemComponent } from "../solved-report-item/solved-report-item.component";
import { SolvedReport } from 'src/app/models/solved_report.model';

@Component({
  selector: 'app-solved-reports',
  templateUrl: './solved-reports.component.html',
  styleUrls: ['./solved-reports.component.scss'],
  imports: [IonContent, IonRefresher, IonRefresherContent, IonList, IonInfiniteScroll, IonInfiniteScrollContent, SolvedReportItemComponent]
})
export class SolvedReportsComponent  implements OnInit {
  private _solvedReports: SolvedReport[] = [];
  private _start: number = 0;
  private _limit = 50;
  private _isLoading: boolean = false;

  solvedReports: SolvedReport[] = [];
  disabled: boolean = false;

  constructor(private solvedService: SolvedService) {}

  private refresh() {
    this._solvedReports = this.solvedService.getSolvedReports();
    this.solvedReports = [];
    this._start = 0;
    this._addSolvedReports();
  }

  ngOnInit() {
    this.refresh();
  }

  private _addSolvedReports() {
    const length = this._solvedReports.length;
    for (let i = 0; i < this._limit && this.solvedReports.length < length; i++) {
      this.solvedReports.push(this._solvedReports[this._start++]);
    }
  }

  onIonInfinite(event: IonInfiniteScrollCustomEvent<void>) {
    if (this._solvedReports.length !== this.solvedReports.length) {
      if (this._isLoading) return;
      this._isLoading = true;
  
      setTimeout(() => {
        this._addSolvedReports();
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
