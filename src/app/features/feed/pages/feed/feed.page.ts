import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonSearchbar, IonList, IonItem, IonAvatar, IonImg, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { UserCardComponent } from "../../components/user-card/user-card.component";
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
import { SearchUserInfo } from 'src/app/models/search-user-info.model';
import { SessionCard } from 'src/app/models/session-card.model';
import { SessionModalComponent } from "src/app/shared/components/session-modal/session-modal.component";
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonLabel, IonImg, IonAvatar, IonItem, IonList, IonSearchbar, IonModal, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, UserCardComponent]
})
export class FeedPage implements OnInit {

  public users:SearchUserInfo[] = [
    {
      username: "giovanni",
      avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10"
    },
    {
      username: "marco",
      avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10"
    },
    {
      username: "luigi",
      avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10"
    }
  ]

  public user_sessions:SessionCard[] = [
    {
      username: "pippoesp",
      sessionName: "fazzu petto",
      gainedXP: 104,
      tags: ["Petto", "Tricipiti", "Spalle", "Quadricipiti"],
      avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
      verified: true,
      pt: true,
    },
    {
      username: "pippoesp",
      sessionName: "fazzu petto",
      gainedXP: 104,
      tags: ["Petto", "Tricipiti", "Spalle", "Quadricipiti"],
      avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
      verified: true,
      pt: true,
    },
    {
      username: "pippoesp",
      sessionName: "fazzu petto",
      gainedXP: 104,
      tags: ["Petto", "Tricipiti", "Spalle", "Quadricipiti"],
      avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCFcnFU-TPgls_fB_Jw1lCXlhgIcdFZPAd9Yd3c5ByMfs3x1CsT1F1YDvUQn5Uqc1eJkqtfulYApjOeOe5IM__iLozHusE6wKe9j2OGI&s=10",
      verified: true,
      pt: true,
    }
  ]

  constructor() {
    addIcons({searchOutline});
  }

  ngOnInit() {
  }

}
