import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SessionCardComponent } from "../../components/session-card/session-card.component";
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/shared/services/user-service';
import { Session } from 'src/app/models/session.model';
import { SessionService } from 'src/app/shared/services/session-service';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { ModalController } from '@ionic/angular/standalone';
import { SessionViewModalPage } from '../session-view-modal/session-view-modal.page';

@Component({
  selector: 'app-session-view',
  templateUrl: './sessions-view.page.html',
  styleUrls: ['./sessions-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SessionCardComponent]
})
export class SessionViewPage implements OnInit {

  private _sessions = signal<Session[]>([]);
  private _start = 0;
  private _limit = 10;
  private _isLoading = false;

  user = signal<User | null>(null);
  sessions = signal<Session[]>([]);
  disabled = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
    private sessionService: SessionService,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    addIcons({arrowBack});
    const tmp = this.route.snapshot.paramMap.get('username');
    if (!tmp) this.location.back();

    this.userService.user(tmp as string).subscribe(user => {
      this.user.set(user); 
      this._loadSessions();
    })
  }

  private _loadSessions(event?: any) {
    this.sessionService.allOf(this.user()?.id ?? -1).subscribe(sessions => {
      this._sessions.set([...sessions]);
      this._start = 0;
      this.sessions.set([]);
      this._addSessions();
      if (event) event.target.complete();
    });
  }

  private _addSessions() {
    const all = this._sessions();
    const currentVisible = this.sessions();
    
    if (currentVisible.length >= all.length) {
      this.disabled = true;
      return;
    }

    const nextBatch = all.slice(this._start, this._start + this._limit);
    
    this.sessions.update(prev => [...prev, ...nextBatch]);
    this._start += this._limit;
  }

  onIonInfinite(event: IonInfiniteScrollCustomEvent<void>) {
    console.log(this.sessions.length);
    console.log(this._sessions.length);
    if (this.sessions.length !== this._sessions.length) {
      if (this._isLoading) return;

      this._isLoading = true;

      setTimeout(() => {
        this._addSessions();
        this._isLoading = false;
        event.target.complete();
      }, 500);
    } else {
      this.disabled = true;
    }
  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    this._loadSessions(event);
  }

  goBack() {
    this.location.back();
  }

  async openSessionModal(session: Session) {
    const modal = await this.modalController.create({
      component: SessionViewModalPage,
      cssClass: 'session-view-modal',
      componentProps: {
        session: structuredClone(session)
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.sessionService.updateSessionValidity(data.id, this.user()?.id ?? -1, data.exercises).subscribe({
        next: (value) => {
          if (value.updated) {
            console.log("VALIDITY OK");
            var index = this.sessions().findIndex(s => s.id === data.id);
            if (index !== -1) {
              this.sessions.update(value => {
                value[index] = data;
                return value;
              });
            }

            var index = this.sessions().findIndex(s => s.id === data.id);
            if (index !== -1) {
              this._sessions.update(value => {
                value[index] = data;
                return value;
              })
            }
            this._showToast('Session updated correctly', 'success', 1000);
          }
        },
        error: (err) => {
          this._showToast("Error: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
        }
      });
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
}
