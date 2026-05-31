import { Component, OnInit, signal } from '@angular/core';
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
  user = signal<User | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService
  ) {
      addIcons({arrowBack,checkmarkCircle});}

  ngOnInit() {
    addIcons({
      arrowBack,
      checkmarkCircle
    });
    const tmp = this.route.snapshot.paramMap.get('username');
    if (!tmp) return this.location.back();

    this.userService.user(tmp as string).subscribe(user => {
      this.user.set(user);
    });
    const u = this.user();
    if (!u) return this.location.back();

    this._originalValue = u.verified;
  }

  onToggleVerified(_: IonToggleCustomEvent<ToggleChangeEventDetail<any>>) {
    this.user.update(user => {
      if (!user) return;
      user.verified = !user.verified;
      return user;
    });
  }

  goBack() {
    this.location.back();
  }

  saveChanges() {
    const u = this.user();
    if (!u) return;

    if (this._originalValue != u.verified)
      this.userService.updateVerified(u);
    this.goBack();
  }
}
