import { Component, OnInit, signal } from '@angular/core';
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
import { AlertController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ModAuthService } from '../../services/mod-auth-service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReportSlidingItemComponent, IonicModule]
})
export class ReportsPage implements OnInit {

  private _reports = signal<Report[]>([]);
  private _start = 0;
  private _limit = 25;
  private _isLoading: boolean = false;

  reports = signal<Report[]>([]);
  disabled: boolean = false;
  isAlertOpen: boolean = false;

  constructor(
    private modAuthService: ModAuthService,
    private reportService: ReportService,
    private location: Location,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({'arrow-back':arrowBack});
  }

  ngOnInit() {
    this._loadData();
  }

  _loadData(event?: any) {
    this.reportService.reports().subscribe({
      next: (reports) => {
        this._reports.set([...reports]);
        this.reports.set([]);
        this._start = 0;
        this.disabled = false;
        this._addReports();
        if (event) event.target.complete();
        this._showToast('Reports loaded correctly', 'success', 500);
      },
      error: (err) => {
        this._showToast("Error: " + (err.error?.message ?? 'Unkown'), 'danger', 2000);
        if (event) event.target.complete();
      }
    })
  }

  private _addReports() {
    const all = this._reports();
    const currentVisible = this.reports();
    
    if (currentVisible.length >= all.length) {
      this.disabled = true;
      return;
    }

    const nextBatch = all.slice(this._start, this._start + this._limit);
    
    this.reports.update(prev => [...prev, ...nextBatch]);
    this._start += this._limit;
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
    this._loadData(event);
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
    this.reportService.confirmReport(report.id, this.modAuthService.getModerator()?.id, outcome).subscribe({
      next: (value) => {
        if (value.confirmed) {
          this._showToast("Report #" + report.id + " solved correctly", 'success', 1000);
          this._loadData();
        }
      },
      error: (err) => {
        this._showToast("Error: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
      }
    })
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

  private async _showToast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: duration
    });
    await toast.present();
  }
}
