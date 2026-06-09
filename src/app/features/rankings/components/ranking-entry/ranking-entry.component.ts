import { Component, computed, effect, input, OnInit, signal } from '@angular/core';
import { IonAvatar, IonItem, IonLabel, IonIcon } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { RankUser } from 'src/app/models/rank-user.model';
import { LevelIconComponent } from "src/app/shared/components/level-icon/level-icon.component";
import { PROPIC_PATH } from 'src/app/shared/global';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/shared/services/user-service';
import { addIcons } from 'ionicons';
import { barbellOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ranking-entry',
  templateUrl: './ranking-entry.component.html',
  styleUrls: ['./ranking-entry.component.scss'],
  imports: [IonIcon, IonLabel, IonItem, IonAvatar, LevelIconComponent],
})
export class RankingEntryComponent  implements OnInit {

  readonly DEFAULT_AVATAR_ICON: string = 'assets/icon/favicon.png';
  rankUser = input.required<RankUser>();
  type = input.required<"global" | "seasonal">();

  seasonalUrl = signal<string>(PROPIC_PATH);

  globalUrl = computed(() => {
    const user = this.rankUser();
    if (!user) return PROPIC_PATH;
    return `${environment.apiUrl}/api/imgs/global-icon/${user.level}`;
  });

  constructor(private router: Router, private userService: UserService) {
    addIcons({barbellOutline});
    effect(() => {
      const user = this.rankUser();
      if (!user) return;

      this.userService.getSeasonalIcon(user.username).subscribe({
        next: (value) => {
          this.seasonalUrl.set(value);
        },
        error: (err) => {
          console.error(err);
        }
      });
    });
  }

  ngOnInit() {}

  onClick(_: Event) {
    this.router.navigate([`/tabs/profile/${this.rankUser().username}`]);
  }
}
