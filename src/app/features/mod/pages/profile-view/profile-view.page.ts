import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar, IonListHeader, IonLabel, IonList, IonItem, IonIcon, IonToggle, IonText, IonGrid, IonRow, IonCol, ToggleChangeEventDetail, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/shared/services/user-service';
import { IonToggleCustomEvent } from '@ionic/core';
import { addIcons } from 'ionicons';
import { arrowBack, checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.page.html',
  styleUrls: ['./profile-view.page.scss'],
  standalone: true,
  imports: [IonButton, IonText, IonToggle, IonIcon, IonItem, IonLabel, IonListHeader, IonAvatar, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProfileViewPage implements OnInit {

  private _originalValue: boolean = false;
  user!: User;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService
  ) {}

  ngOnInit() {
    addIcons({
      arrowBack,
      checkmarkCircle
    });
    const tmp = this.route.snapshot.paramMap.get('username');
    if (!tmp) this.location.back();

    this.user = this.userService.user(tmp as string);
    this._originalValue = this.user.verified;
  }

  onToggleVerified(_: IonToggleCustomEvent<ToggleChangeEventDetail<any>>) {
    this.user.verified = !this.user.verified;
  }

  goBack() {
    this.location.back();
  }

  saveChanges() {
    if (this._originalValue != this.user.verified)
      this.userService.updateVerified(this.user);
    this.goBack();
  }
}
