import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-session-view',
  templateUrl: './sessions-view.page.html',
  styleUrls: ['./sessions-view.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SessionViewPage implements OnInit {

  username!: string;

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    const tmp = this.route.snapshot.paramMap.get('username');
    if (!tmp) this.location.back();
    this.username = tmp as string;
  }

}
