import { Component, EnvironmentInjector, inject, signal } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, person, search, barbell, trophy, fitness} from 'ionicons/icons';
import { NgClass } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, NgClass],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  profileClass = signal<"me" | "other">("me");

  constructor(private router: Router) {
    addIcons({ triangle, ellipse, square, trophy, person, search, barbell, fitness});
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(() => {
      const regex = /\/tabs\/profile\/.+$/;
      if (this.router.url.match(regex)) {
        this.profileClass.set('other');
      } else {
        this.profileClass.set('me');
      }
    });
  }
}
