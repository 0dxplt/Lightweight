import { Component, computed, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonSearchbar, IonList, IonItem, IonAvatar, IonImg, IonLabel, IonButton, IonIcon, IonRefresher, IonRefresherContent, IonCard } from '@ionic/angular/standalone';
import { UserCardComponent } from "../../components/user-card/user-card.component";
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
import { SearchUserInfo } from 'src/app/models/search-user-info.model';
import { SessionCard } from 'src/app/models/session-card.model';
import { ModalController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonRefresherCustomEvent, IonSearchbarCustomEvent, RefresherEventDetail, SearchbarInputEventDetail } from '@ionic/core';
import { FeedService } from 'src/app/shared/services/feed-service';
import { UserService } from 'src/app/shared/services/user-service';
import { AuthService } from 'src/app/features/auth/services/auth-service';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, IonIcon, IonButton, IonLabel, IonAvatar, IonList, IonSearchbar, IonModal, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, UserCardComponent]
})
export class FeedPage implements OnInit {

  private modalController = inject(ModalController);
  private router = inject(Router);

  private data = signal<SearchUserInfo[]>([]);

  public user_sessions = signal<SessionCard[]>([]);

  private feedService = inject(FeedService);

  private userService = inject(UserService);

  public hasSession = computed(() => this.user_sessions().length > 0);

  public ricerca = signal<string>("");

  public users = computed(() => {
    const ricercaUtente = this.ricerca().toLowerCase().trim();

    if (!ricercaUtente) return this.data();

    return this.data().filter(u => {
      const username = u.username.toLowerCase();
      const name = u.name?.toLowerCase() || '';
      const surname = u.surname?.toLowerCase() || '';

      return username.includes(ricercaUtente) ||
        name.includes(ricercaUtente) ||
        surname.includes(ricercaUtente);
    })
  })

  @ViewChild('searchModal') searchModal!: IonModal;

  constructor(private authService: AuthService) {
    addIcons({ searchOutline });

    effect(() => {
      const user = this.authService.user();
      if (!user) return;

      this._loadData();
    });
  }

  ngOnInit() {
    // this._loadData();
  }

  ngAfterViewInit() {
    this.searchModal.ionModalDidDismiss.subscribe(() => {
      this.ricerca.set("");
    });
  }

  private _loadData(event?: any) {
    let completed: boolean = false;
    this.userService.getUsersMinimal().subscribe({
      next: (data) => {
        this.data.set(data);
        if (!completed && event) {
          event.target.complete();
          completed = true;
        }
      },
      error: (err) => {
        console.error(err);
      }
    })
    this.feedService.getFeed().subscribe({
      next: (data) => {
        this.user_sessions.set(data);
        if (!completed && event) {
          event.target.complete();
          completed = true;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  searchUser(event: IonSearchbarCustomEvent<SearchbarInputEventDetail>) {
    this.ricerca.set(event.detail.value?.toLowerCase() || '');
  }

  visitProfile(username: string) {
    this.modalController.dismiss();
    this.router.navigate(['tabs/profile/', username]);
  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    this._loadData(event);
  }

  async openSearchModal() {
    await this.searchModal.present();
  }
}
