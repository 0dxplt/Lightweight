import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RefresherEventDetail } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { Report } from 'src/app/models/report.model';
import { ReportService } from '../../services/report-service';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent } from '@ionic/core';
import { ReportSlidingItemComponent } from "../../components/report-sliding-item/report-sliding-item.component";
import { ExtendedReportModalPage } from '../extended-report-modal/extended-report-modal.page';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { ModAuthService } from '../../services/mod-auth-service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReportSlidingItemComponent, IonicModule]
})
export class ReportsPage implements OnInit {

  private _reports: Report[] = [];
  private _start = 0;
  private _limit = 25;
  private _isLoading: boolean = false;

  reports: Report[] = [];
  disabled: boolean = false;
  isAlertOpen: boolean = false;

  constructor(
    private modAuthService: ModAuthService,
    private reportService: ReportService,
    private location: Location,
    private modalController: ModalController,
    private alertController: AlertController) {}

  ngOnInit() {
    addIcons({'arrow-back':arrowBack});
    this.refresh();
  }

  refresh() {
    this._reports = this.reportService.reports();
    this.reports = [];
    this._start = 0;
    this._addReports();
  }

  private _addReports() {
    const length = this._reports.length;
    for (let i = 0; i < this._limit && this.reports.length < length; i++) {
      this.reports.push(this._reports[this._start++]);
    }
  }

  goBack() {
    this.location.back();
  }

  onIonInfinite(event: IonInfiniteScrollCustomEvent<void>) {
    if (this._reports.length !== this.reports.length) {
      if (this._isLoading) return;
      this._isLoading = true;
  
      setTimeout(() => {
        this._addReports();
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

  async openModal(report: Report) {
    const modal = await this.modalController.create({
      component: ExtendedReportModalPage,
      cssClass: 'extended-report-modal',
      initialBreakpoint: 0.4,
      breakpoints: [0, 0.4, 0.8, 1.0],
      handle: true,
      componentProps: {
        report: report,
        solvedReport: null,
        solved: false
      }
    });

    await modal.present();
  }

  private _confirmReport(report: Report, outcome: string) {
    this.reportService.confirmReport(report.id, this.modAuthService.getModerator()?.id, outcome);
    this.refresh();
  }

  async requestOutcome(report: Report) {
    const alertButtons = [{
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Confirm',
      role: 'confirm',
      handler: (data: any) => {
        const outcome: string = data.outcome;
        if (outcome && outcome.trim() !== '') {
          console.log('Alert confirmed with outcome:', outcome);
          this._confirmReport(report, outcome);
        }
        return true;
      },
    }];
    
    const alertInputs = [{
      name: 'outcome',
      placeholder: 'Outcome',
      attributes: {
        autocomplete: 'off'
      }
    }];

    const alert = await this.alertController.create({
      header: 'Write an outcome',
      subHeader: 'Report #' + report.id,
      message: '',
      buttons: alertButtons,
      inputs: alertInputs
    });

    await alert.present();
  }

}
