import { Component, effect, input, OnInit, signal } from '@angular/core';
import { IonAvatar, IonItem, IonBadge, IonLabel } from "@ionic/angular/standalone";
import { RankUser } from '../../services/ranking-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ranking-entry',
  templateUrl: './ranking-entry.component.html',
  styleUrls: ['./ranking-entry.component.scss'],
  imports: [IonLabel, IonItem, IonAvatar, IonBadge],
})
export class RankingEntryComponent  implements OnInit {

  readonly DEFAULT_AVATAR_ICON: string = '../../../assets/icon/favicon.png';
  rankUser = input.required<RankUser>();
  displayAvatar = signal<string>('');

  constructor(private router: Router) {
    effect(() => {
      this.displayAvatar.set(this.rankUser().avatar);
    });
  }

  ngOnInit() {}

  onClick(_: Event) {
    this.router.navigate(["/profile/" + this.rankUser()?.username]);
  }

  handleImageError() {
    this.displayAvatar.set(this.DEFAULT_AVATAR_ICON);
  }
}
