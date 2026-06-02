import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Report } from 'src/app/models/report.model';
import { SolvedReport } from 'src/app/models/solved_report.model';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { calendarOutline, megaphoneOutline, personCircleOutline, shieldCheckmarkOutline, timeOutline } from 'ionicons/icons';
import { DatefyPipe } from "../../../../shared/pipes/datefy-pipe";

@Component({
  selector: 'app-extended-report-modal',
  templateUrl: './extended-report-modal.page.html',
  styleUrls: ['./extended-report-modal.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, DatefyPipe]
})
export class ExtendedReportModalPage implements OnInit {

  @Input() report: Report | null = null;
  @Input() solvedReport: SolvedReport | null = null;
  @Input() solved: boolean = false;

  constructor(private modalController: ModalController, private router: Router) {}

  ngOnInit() {
    addIcons({personCircleOutline, timeOutline, shieldCheckmarkOutline, calendarOutline, megaphoneOutline});
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    })
  }

  goToProfileView(username: string | null | undefined) {
    if (!username) return;
    this.dismiss();
    this.router.navigate(
      ['mod/profile-view/', username],
      {
        queryParams: {
          editVerified: true
        }
      }
    );
  }

  goToSessionsView(username: string | null | undefined) {
    if (!username) return;
    this.dismiss();
    this.router.navigate(["mod/sessions-view/" + username]);
  }
}
