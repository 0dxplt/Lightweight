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
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.page.html',
  styleUrls: ['./profile-view.page.scss'],
  standalone: true,
  imports: [IonButton, IonToggle, IonIcon, IonItem, IonLabel, IonListHeader, IonAvatar, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProfileViewPage implements OnInit {

  private _originalValue: boolean = false;
  user = signal<User | undefined>(undefined);
  canEditVerified = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
    private toastController: ToastController
  ) {
      addIcons({arrowBack,checkmarkCircle});
    }

  ngOnInit() {
    const tmp = this.route.snapshot.paramMap.get('username');
    if (!tmp) return this.location.back();

    const editParam = this.route.snapshot.queryParamMap.get('editVerified');
    this.canEditVerified.set(editParam === 'true');

    this.userService.user(tmp as string).subscribe({
      next: (user) => {
        this.user.set(user);
        this._originalValue = user.verified;
      }
    });
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

  private async _showToast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: duration
    });
    await toast.present();
  }

  saveChanges() {
    const u = this.user();
    if (!u) return;

    if (this._originalValue != u.verified) {
      this.userService.updateVerified(u.id, u.verified).subscribe({
        next: (value) => {
          if (value.status_changed) {
            this._showToast('User\'s status modified', 'success', 500);
          }
        },
        error: (err) => {
          this._showToast('Error: ' + (err.error?.message ?? 'Unknown'), 'danger', 2000);
        }
      });
    }
    this.goBack();
  }
}
