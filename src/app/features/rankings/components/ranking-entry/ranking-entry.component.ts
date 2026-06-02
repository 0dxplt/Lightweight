import { Component, effect, input, OnInit, signal } from '@angular/core';
import { IonAvatar, IonItem, IonBadge, IonLabel } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { RankUser } from 'src/app/models/rank-user.model';

@Component({
  selector: 'app-ranking-entry',
  templateUrl: './ranking-entry.component.html',
  styleUrls: ['./ranking-entry.component.scss'],
  imports: [IonLabel, IonItem, IonAvatar, IonBadge],
})
export class RankingEntryComponent  implements OnInit {

  readonly DEFAULT_AVATAR_ICON: string = 'assets/icon/favicon.png';
  rankUser = input.required<RankUser>();

  constructor(private router: Router) {}

  ngOnInit() {}

  onClick(_: Event) {
    this.router.navigate([`/tabs/profile/${this.rankUser().username}`]);
  }
}
