import { Component, input, OnInit, output } from '@angular/core';
import { IonItem, IonItemSliding, IonItemOptions, IonItemOption, IonLabel, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { checkmarkDone } from 'ionicons/icons';
import { Report } from 'src/app/models/report.model';
import { DatefyPipe } from "../../../../shared/pipes/datefy-pipe";
import { ReportService } from '../../services/report-service';

@Component({
  selector: 'app-report-sliding-item',
  templateUrl: './report-sliding-item.component.html',
  styleUrls: ['./report-sliding-item.component.scss'],
  imports: [IonIcon, IonItem, IonItemSliding, IonItemOptions, IonItemOption, IonLabel, DatefyPipe]
})
export class ReportSlidingItemComponent  implements OnInit {

  report = input.required<Report>();
  onConfirm = output<void>();
  onReview = output<void>();

  constructor(private reportService: ReportService) { }

  ngOnInit() {
    addIcons({'checkmark-done':checkmarkDone});
  }

  checkReport(slidingItem: IonItemSliding) {
    this.onConfirm.emit();
    slidingItem.close();
  }

  reportReview() {
    console.log("Redirecting to report #" + this.report().id + " extended view");
    this.onReview.emit();
  }
}
