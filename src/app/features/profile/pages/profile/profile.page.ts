import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionSheetController, IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { settings } from 'ionicons/icons';
import { ProfilePageBodyComponent } from '../../components/profile-page-body/profile-page-body.component';
import { ModalController } from '@ionic/angular/standalone';
import { ChangePasswordModalPage } from '../change-password-modal/change-password-modal.page';
import { VerifyProfileModalPage } from '../verify-profile-modal/verify-profile-modal.page';
import { Nation } from 'src/app/models/nation.model';
import { RequestService } from 'src/app/features/mod/services/request-service';
import { VERIFY_MIN_AGE, VERIFY_MIN_FOLLOWERS, VERIFY_MIN_SESSIONS } from 'src/app/shared/global';
import { PtRequestModalPage } from '../pt-request-modal/pt-request-modal.page';
import { Gym } from 'src/app/models/gym.model';
import { City } from 'src/app/models/city.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ProfilePageBodyComponent]
})
export class ProfilePage implements OnInit {

  user = this.authService.user;
  actionSheetButtons = computed(() => {
    const u = this.user();
    const buttons = [
      { text: 'Edit profile', handler: () => {
        this.actionSheetController.dismiss();
        this.router.navigate(["tabs/profile/edit"])
      }},
      { text: 'Change Password', handler: () => {
        this.actionSheetController.dismiss();
        this.openChangePasswordModal()
      }},
    ];

    if (u && !u.verified && this._canBeVerified()) {
      buttons.push({ text: "Verify Account", handler: () => {
        this.actionSheetController.dismiss();
        this.openVerifyModal();
      }});
    }

    if (u && !u.pt) {
      buttons.push({ text: "PT Badge", handler: () => {
        this.actionSheetController.dismiss();
        this.openPTModal();
      }});
    }

    buttons.push({
      text: 'Log Out',
      handler: () => this._logout()
    });

    return buttons;
  });

  constructor(
    private authService: AuthService,
    private requestService: RequestService,
    private router: Router,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) {
    addIcons({settings});
  }

  ngOnInit() {
    if (!this.authService.isLogged()) {
      this.router.navigate(['login']);
    }
  }

  private _logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  private _canBeVerified() {
    const u = this.user();
    
    if (!u) return false;
      const sessionsCount = u.sessions;
      const followersCount = u.followers;
  
      if (!u.birthdate) return false;
      
      const birthDateObj = new Date(u.birthdate);
      const today = new Date();
      
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
      }
  
      return (
        age >= VERIFY_MIN_AGE && 
        followersCount >= VERIFY_MIN_FOLLOWERS && 
        sessionsCount >= VERIFY_MIN_SESSIONS
      );
  }

  async openChangePasswordModal() {
    const modal = await this.modalController.create({
      component: ChangePasswordModalPage,
      cssClass: 'change-password-modal',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role == 'confirm' && data) {
      this._processPasswordChange(data.old, data.new); 
    }
  }

  private async _processPasswordChange(oldPass: string, newPass: string) {
    const loading = await this.loadingController.create({
      message: 'Processing new password...',
      duration: 10000
    });
    await loading.present();

    this.authService.changePassword(oldPass, newPass).subscribe({
      next: (res) => {
        loading.dismiss();
        this._showToast(res.message, 'success');
      },
      error: (err) => {
        loading.dismiss();
        this._showToast((err.error?.message ?? 'Unkown'), 'danger');
      }
    });
  }

  private async _showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  async openVerifyModal() {
    const modal = await this.modalController.create({
      component: VerifyProfileModalPage,
      cssClass: 'verify-profile-modal',
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' || role === 'already-valid') {
      
      const loading = await this.loadingController.create({
        message: 'Processing request...',
      });
      await loading.present();

      if (role === 'confirm' && data) {
        this._updateUser(data.name, data.surname, data.birthdate, data.nationality);
      }

      setTimeout(() => {
        this.requestService.new(this.user());
        loading.dismiss();
        this._showToast('Validation request sent', 'success');
      }, 2000);
    }
  }

  _updateUser(name: string | null, surname: string | null, birthdate: string | null, nationality: Nation | null) {
    const u = this.user();
    if (!u) return;

    const updatedUser = structuredClone(u);
    
    if (name) updatedUser.name = name;
    if (surname) updatedUser.surname = surname;
    if (nationality) updatedUser.nationality = nationality;
    if (birthdate) updatedUser.birthdate = new Date(birthdate);

    this.authService.update(updatedUser);
  }

  async openPTModal() {
    const modal = await this.modalController.create({
      component: PtRequestModalPage,
      cssClass: "pt-request-modal"
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    console.log(data, role);

    if (role === "confirm" && data) {
      const loading = await this.loadingController.create({
        message: "One moment please...",
      });
      await loading.present();

      // quando si avrà il backend, gestire gli errori (show Toast)
      setTimeout(() => {
        loading.dismiss();
        this._showToast('You are now a Personal Trainer!', 'success');
        this._addPTInfos(data.proemail, data.gym, data.city);
      }, Math.random() * 2500 + 500);
    }
  }

  private _addPTInfos(proemail: string, gym: Gym, city: City) {
    if (!this.user()) return;
    const cpy = structuredClone(this.user());
    
    if (!cpy) return;

    cpy.pt = {
      proEmail: proemail,
      gym: gym,
      city: city
    }

    this.authService.update(cpy);
  }
}
