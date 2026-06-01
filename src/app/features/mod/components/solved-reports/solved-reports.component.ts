import { Component, OnInit, signal } from '@angular/core';
import { SolvedService } from '../../services/solved-service';
import { IonContent, IonRefresher, IonRefresherContent, IonList, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/angular/standalone";
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { SolvedReportItemComponent } from "../solved-report-item/solved-report-item.component";
import { SolvedReport } from 'src/app/models/solved_report.model';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-solved-reports',
  templateUrl: './solved-reports.component.html',
  styleUrls: ['./solved-reports.component.scss'],
  imports: [IonContent, IonRefresher, IonRefresherContent, IonList, IonInfiniteScroll, IonInfiniteScrollContent, SolvedReportItemComponent]
})
export class SolvedReportsComponent  implements OnInit {
  private _solvedReports = signal<SolvedReport[]>([]);
  private _start: number = 0;
  private _limit = 50;
  private _isLoading: boolean = false;

  solvedReports = signal<SolvedReport[]>([]);
  disabled: boolean = false;

  constructor(
    private solvedService: SolvedService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this._loadData();
  }

  private _loadData(event?: any) {
    this.solvedService.getSolvedReports().subscribe({
      next: (reports) => {
        this._solvedReports.set([...reports]);
        this.solvedReports.set([]);
        this._start = 0;
        this.disabled = false;
        this._addSolvedReports();
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

  private _addSolvedReports() {
    const all = this._solvedReports();
    const currentVisible = this.solvedReports();
    
    if (currentVisible.length >= all.length) {
      this.disabled = true;
      return;
    }

    const nextBatch = all.slice(this._start, this._start + this._limit);
    
    this.solvedReports.update(prev => [...prev, ...nextBatch]);
    this._start += this._limit;
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
    this._loadData(event);
  }
}
