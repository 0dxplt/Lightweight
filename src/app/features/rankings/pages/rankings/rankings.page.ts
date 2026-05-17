import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegmentButton, IonLabel, IonSegment, IonSegmentContent, IonSegmentView, IonFooter } from '@ionic/angular/standalone';
import { RankingListComponent } from "../../components/ranking-list/ranking-list.component";

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.page.html',
  styleUrls: ['./rankings.page.scss'],
  standalone: true,
  imports: [IonFooter, IonSegment, IonLabel, IonSegmentButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSegmentContent, IonSegmentView, RankingListComponent]
})
export class RankingsPage implements OnInit {

  constructor() { }

  ngOnInit() {}
}
