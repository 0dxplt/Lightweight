import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonSegmentButton, IonSegment, IonFooter, IonSegmentView, IonSegmentContent, SegmentValue, IonItem, IonIcon, IonButton } from '@ionic/angular/standalone';
import { SolvedReportsComponent } from "../../components/solved-reports/solved-reports.component";
import { SolvedRequestsComponent } from "../../components/solved-requests/solved-requests.component";
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-solved',
  templateUrl: './solved.page.html',
  styleUrls: ['./solved.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonItem, IonFooter, IonSegment, IonSegmentButton, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSegmentView, IonSegmentContent, SolvedReportsComponent, SolvedRequestsComponent]
})
export class SolvedPage implements OnInit {

  segmentValue: SegmentValue | undefined = "reports";

  constructor(private location: Location) {
    addIcons({'arrowBack':arrowBack});
  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }
}
