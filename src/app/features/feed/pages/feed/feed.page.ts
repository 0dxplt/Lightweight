import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonSearchbar, IonList, IonItem, IonAvatar, IonImg, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { UserCardComponent } from "../../components/user-card/user-card.component";
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
import { SearchUserInfo } from 'src/app/models/search-user-info.model';
import { SessionCard } from 'src/app/models/session-card.model';
import { SessionModalComponent } from "src/app/shared/components/session-modal/session-modal.component";
import { ModalController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonSearchbarCustomEvent, SearchbarInputEventDetail } from '@ionic/core';
import { FeedService } from 'src/app/shared/services/feed-service';
import { UserService } from 'src/app/shared/services/user-service';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonLabel, IonAvatar, IonItem, IonList, IonSearchbar, IonModal, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, UserCardComponent]
})
export class FeedPage implements OnInit {

  private modalController = inject(ModalController);
  private router = inject(Router);

  private data = signal<SearchUserInfo[]>([]);

  public user_sessions = signal<SessionCard[]>([]);

  public users = signal<SearchUserInfo[] | null>(null);

  private feedService = inject(FeedService);

  private userService = inject(UserService);

  constructor() {
    addIcons({ searchOutline });
  }

  ngOnInit() {
    this.userService.getUsersMinimal().subscribe({
      next: (data) => {
        this.data.set(data);
        this.users.set([...this.data()]);
      },
      error: (err) => {
        console.error(err);
      }
    })
    this.feedService.getFeed().subscribe({
      next: (data) => {
        this.user_sessions.set(data);
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  searchUser(event: IonSearchbarCustomEvent<SearchbarInputEventDetail>) {
    const query = event.detail.value?.toLowerCase() || '';

    if (!query.trim()) {
      this.users.set([...this.data()]);
      return;
    }

    const filtered = this.data().filter(u => {
      const username = u.username.toLowerCase();
      const name = u.name?.toLowerCase() || '';
      const surname = u.surname?.toLowerCase() || '';

      return username.includes(query) ||
        name.includes(query) ||
        surname.includes(query);
    });

    this.users.set(filtered);
  }

  visitProfile(username: string) {
    this.modalController.dismiss();
    this.router.navigate(['tabs/profile/', username]);
  }

}
