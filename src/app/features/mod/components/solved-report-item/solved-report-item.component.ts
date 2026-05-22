import { Component, input, OnInit } from '@angular/core';
import { SolvedReport } from 'src/app/models/solved_report.model';
import { DatefyPipe } from 'src/app/shared/pipes/datefy-pipe';
import { ExtendedReportModalPage } from '../../pages/extended-report-modal/extended-report-modal.page';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-solved-report-item',
  templateUrl: './solved-report-item.component.html',
  styleUrls: ['./solved-report-item.component.scss'],
  imports: [DatefyPipe, IonicModule],
})
export class SolvedReportItemComponent  implements OnInit {

  solvedReport = input.required<SolvedReport>();

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async openModal(report: SolvedReport) {
    const modal = await this.modalController.create({
      component: ExtendedReportModalPage,
      cssClass: 'extended-report-modal',
      initialBreakpoint: 0.4,
      breakpoints: [0, 0.4, 0.8, 1.0],
      handle: true,
      componentProps: {
        report: null,
        solvedReport: report,
        solved: true
      }
    });

    await modal.present();
  }
}
