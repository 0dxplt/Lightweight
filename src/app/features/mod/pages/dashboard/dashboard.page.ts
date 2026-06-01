import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonButtons, IonFabButton, IonFab, IonCardContent, IonCard, IonCol, IonRow, IonGrid, IonCardTitle, IonCardSubtitle, IonActionSheet, IonRefresherContent, IonRefresher, RefresherEventDetail } from '@ionic/angular/standalone';
import { ModAuthService } from '../../services/mod-auth-service';
import { Router } from '@angular/router';
import { Moderator } from 'src/app/models/moderator.model';
import { addIcons } from 'ionicons';
import { chevronUp, checkmarkCircle, alertCircle, folder, logOut } from 'ionicons/icons';
import { SolvedService } from '../../services/solved-service';
import { RequestService } from '../../services/request-service';
import { ReportService } from '../../services/report-service';
import { IonRefresherCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonRefresher, IonRefresherContent, IonActionSheet, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonFab, IonFabButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCardTitle, IonCardSubtitle]
})
export class DashboardPage implements OnInit {

  public actionSheetButtons = [
    {
      text: 'Log Out',
      icon: 'log-out',
      handler: () => {
        this.modAuthService.logout();
        this.router.navigate(['mod/login']);
      }
    },
    {
      text: 'Cancel',
      role: 'cancel'
    }
  ];

  moderator = this.modAuthService.moderator;
  numReports = signal<number>(0);
  numRequests = signal<number>(0);
  numSolved = signal<number>(0);

  constructor(
    private modAuthService: ModAuthService,
    private requestsService: RequestService,
    private reportsService: ReportService,
    private solvedService: SolvedService,
    private router: Router
  ) {
    if (!this.modAuthService.isModLogged()) this.router.navigate(["mod/login"]);
    this._initCounters();
  }

  ngOnInit() {
    addIcons({'chevron-up':chevronUp, 'checkmark-circle':checkmarkCircle, 'alert-circle':alertCircle, 'folder':folder, 'log-out':logOut});
  }

  reports() {
    this.router.navigate(['mod/reports']);
  }

  requests() {
    this.router.navigate(['mod/requests']);
  }

  solved() {
    this.router.navigate(['mod/solved']);
  }

  private _initCounters(event?: any) {
    this.reportsService.numberOfReports().subscribe(counter => {
      this.numReports.set(counter);
    });
    this.requestsService.numberOfRequests().subscribe(counter => {
      this.numRequests.set(counter);
    });
    this.solvedService.numberOfSolved().subscribe(counter => {
      this.numSolved.set(counter);
    });
    if (event) event.target.complete();
  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    this._initCounters(event);
  }
}
