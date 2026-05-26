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

  private data: SearchUserInfo[] = [];

  public user_sessions: SessionCard[] = [];

  public users = signal<SearchUserInfo[] | null>(null);

  constructor() {
    addIcons({ searchOutline });
  }

  ngOnInit() {
    // TODO: fetch al db
    this.data = [
      {
        username: "giovanni",
        name: "Giovanni",
        surname: "Esposito",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10"
      },
      {
        username: "marco",
        name: "Marco",
        surname: "Esposito",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10"
      },
      {
        username: "luigino",
        name: "Luigi",
        surname: "Esposito",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10"
      }
    ];
    this.users.set([...this.data]);
    this.user_sessions = [
      {
        username: "pippoesp",
        sessionName: "fazzu petto",
        sessionId: 34424,
        gainedXP: 104,
        tags: ["Petto", "Tricipiti", "Spalle", "Quadricipiti"],
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
        verified: true,
        pt: true,
      },
      {
        username: "pippoesp",
        sessionName: "fazzu petto",
        sessionId: 34424,
        gainedXP: 104,
        tags: ["Petto", "Tricipiti", "Spalle", "Quadricipiti"],
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
        verified: true,
        pt: true,
      },
      {
        username: "pippoesp",
        sessionName: "fazzu petto",
        sessionId: 34424,
        gainedXP: 104,
        tags: ["Petto", "Tricipiti", "Spalle", "Quadricipiti"],
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
        verified: true,
        pt: true,
      }
    ];

  }

  searchUser(event: IonSearchbarCustomEvent<SearchbarInputEventDetail>) {
    const query = event.detail.value?.toLowerCase() || '';

    if (!query.trim()) {
      this.users.set([...this.data]);
      return;
    }

    const filtered = this.data.filter(u => {
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
