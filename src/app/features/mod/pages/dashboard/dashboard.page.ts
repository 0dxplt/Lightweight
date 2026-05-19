import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonButtons, IonFabButton, IonFab, IonCardContent, IonCard, IonCol, IonRow, IonGrid, IonCardTitle, IonCardSubtitle, IonActionSheet } from '@ionic/angular/standalone';
import { ModAuthService } from '../../services/mod-auth-service';
import { Router } from '@angular/router';
import { Moderator } from 'src/app/models/moderator.model';
import { addIcons } from 'ionicons';
import { chevronUp, checkmarkCircle, alertCircle, folder, logOut } from 'ionicons/icons';
import { SolvedService } from '../../services/solved-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonActionSheet, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonFab, IonFabButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCardTitle, IonCardSubtitle]
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
  numSolved: number;

  constructor(private modAuthService: ModAuthService, private solvedService: SolvedService, private router: Router) {
    if (!this.modAuthService.isModLogged()) this.router.navigate(["mod/login"]);
    this.numSolved = this.solvedService.getNumberOfSolved();
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

  showSettings() {
    console.log("SHOW SETTINGS");
  }

}
