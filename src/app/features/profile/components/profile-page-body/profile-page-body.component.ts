import { Component, computed, input, model, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { barbellOutline, checkmarkCircle } from 'ionicons/icons';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { User } from 'src/app/models/user.model';
import { GLOBAL_RANK_UP, PROPIC_PATH, SEASONAL_RANK_UP, XP_LIMIT } from 'src/app/shared/global';
import { SessionCardComponent } from "src/app/features/mod/components/session-card/session-card.component";
import { Session } from 'src/app/models/session.model';
import { SessionService } from 'src/app/shared/services/session-service';
import { ModalController, RefresherEventDetail } from '@ionic/angular/standalone';
import { ViewSessionModalPage } from '../../pages/view-session-modal/view-session-modal.page';
import { PtInfoModalPage } from '../../pages/pt-info-modal/pt-info-modal.page';
import { FollowingModalPage } from '../../pages/following-modal/following-modal.page';
import { FollowersModalPage } from '../../pages/followers-modal/followers-modal.page';
import { IonRefresherCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-profile-page-body',
  templateUrl: './profile-page-body.component.html',
  styleUrls: ['./profile-page-body.component.scss'],
  imports: [IonicModule, SessionCardComponent]
})
export class ProfilePageBodyComponent  implements OnInit {

  user = input.required<User | null>();
  verified = computed(() => {
    const user = this.user();
    if (!user) return false;
    return user.verified;
  });
  isPT = computed(() => {
    const user = this.user();
    if (!user) return false;
    return user.pt !== null && user.pt !== undefined;
  });
  hasPropic = computed(() => {
    const user = this.user();
    if (!user) return false;
    return user.propic !== null && user.propic !== undefined && user.propic !== PROPIC_PATH;
  });
  hasName = computed(() => {
    const user = this.user();
    if (!user) return false;
    return user.name !== null && user.name !== undefined;
  });
  hasSurname = computed(() => {
    const user = this.user();
    if (!user) return false;
    return user.surname !== null && user.surname !== undefined;
  });
  hasNationality = computed(() => {
    const user = this.user();
    if (!user) return false;
    return user.nationality !== null && user.nationality !== undefined;
  })
  hasBirthdate = computed(() => {
    const user = this.user();
    if (!user) return false;
    return user.birthdate !== null && user.birthdate !== undefined;
  });
  age = computed(() => {
      const user = this.user();
      if (!user) return null;

      const bdate = user.birthdate;
      if (!bdate) return null;

      const birthDateObj = new Date(bdate);
      const today = new Date();
      
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
      }

      return age;
  })
  sameAsProfile = computed(() => {
    const user = this.user();
    const profile = this.authService.user();
    if (!user || !profile) return false;
    return user.username === profile.username;
  });
  seasonalPerc = computed(() => {
    const user = this.user();
    if (!user) return 0;
    if (user.sxp >= SEASONAL_RANK_UP) return 1;
    return user.sxp / SEASONAL_RANK_UP;
  });
  globalPerc = computed(() => {
    const user = this.user();
    if (!user) return 0;
    if (user.gxp >= GLOBAL_RANK_UP) return 1;
    return user.gxp / GLOBAL_RANK_UP;
  });

  sessions = signal<Session[]>([]);

  constructor(
    private router: Router,
    private authService: AuthService,
    private sessionService: SessionService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    addIcons({barbellOutline, checkmarkCircle});
  }

  ngOnInit() {
    const user = this.user();
    if (!user) {
      if (this.authService.isLogged())
        this.router.navigate(["profile"]);
      else
        this.router.navigate(["login"]);

      return;
    }

    this._loadData();
  }

  private _loadData(event?: any) {
    this.sessionService.allOf(this.user()?.id ?? -1).subscribe({
      next: sessions => {
        this.sessions.set([...sessions]);
        if (!this.sameAsProfile()) {
          this.sessions.set(this.sessions().filter(s => s.shared));
        }
        if (event) event.target.complete();
        this._showToast('Sessions loaded correctly', 'success', 1000);
      },
      error: (err) => {
        if (event) event.target.complete();
        this._showToast("Error: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
      }
    });
  }

  async openPTInfoModal() {
    const user = this.user();
    if (!user) return;

    const ptModal = await this.modalController.create({
      component: PtInfoModalPage,
      cssClass: "pt-info-modal",
      handle: false,
      initialBreakpoint: 0.8,
      backdropDismiss: true,
      componentProps: {
        gym: user.pt?.gym
      }
    });

    await ptModal.present();
  }

  async openSessionModal(session: Session) {
    const modal = await this.modalController.create({
      component: ViewSessionModalPage,
      cssClass: "view-session-modal",
      componentProps: {
        session: session,
        isProfile: this.sameAsProfile()
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role && data) {   
      const loading = await this.loadingController.create({
        message: "Deleting session..."
      });
      await loading.present();

      if (role === 'delete') {
        this.sessionService.removeSession(data.id).subscribe({
          next: (value) => {
            if (value.removed) {
              loading.dismiss();
              this._removeFromUI(data);
              this._showToast('Session removed correctly', 'success', 500);              
            }
          },
          error: (err) => {
            loading.dismiss();
            this._showToast("Error: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
          }
        });
      } else if (role === 'sharing') {
        this.sessionService.updateSessionVisibility(data.id, data.shared).subscribe({
          next: (value) => {
            if (value.updated) {
              loading.dismiss();
              this._updateUI(data);
              this._showToast('Visibility updated correctly', 'success', 500);
            }
          },
          error: (err) => {
            loading.dismiss();
            this._showToast("Error: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
          }
        });
      }
    }
  }

  private async _showToast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: duration
    });

    await toast.present();
  }

  private _updateUI(session: Session) {
    const index = this.sessions().findIndex(s => s.id === session.id);
    if (index > -1) {
      this.sessions.update(s => {
        s[index] = session;
        return s;
      })
    }
  }

  private _removeFromUI(session: Session) {
    this.sessions.update(s => s.filter(se => se.id !== session.id));
  }

  async openFollowingModal() {
    const user = this.user();
    if (!user) return;

    const modal = await this.modalController.create({
      component: FollowingModalPage,
      cssClass: 'following-modal',
      handle: true,
      backdropDismiss: true,
      expandToScroll:false,
      initialBreakpoint: 0.4,
      breakpoints: [0, 0.4, 0.8, 1.0],
      componentProps: {
        username: user.username
      }
    });

    await modal.present();
  }

  async openFollowersModal() {
    const user = this.user();
    if (!user) return;

    const modal = await this.modalController.create({
      component: FollowersModalPage,
      cssClass: 'followers-modal',
      handle: true,
      expandToScroll:false,
      backdropDismiss: true,
      initialBreakpoint: 0.4,
      breakpoints: [0, 0.4, 0.8, 1.0],
      componentProps: {
        username: user.username
      }
    });

    await modal.present();
  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    this._loadData(event);
  }
}
