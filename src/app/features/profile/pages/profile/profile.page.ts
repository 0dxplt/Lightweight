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

    if (u && !u.verified /*&& this._canBeVerified()*/) {
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

  // Migrato sul backend
  // private _canBeVerified() {
  //   const u = this.user();
    
  //   if (!u) return false;
  //     const sessionsCount = u.sessions;
  //     const followersCount = u.followers;
  
  //     if (!u.birthdate) return false;
      
  //     const birthDateObj = new Date(u.birthdate);
  //     const today = new Date();
      
  //     let age = today.getFullYear() - birthDateObj.getFullYear();
  //     const monthDiff = today.getMonth() - birthDateObj.getMonth();
      
  //     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
  //       age--;
  //     }
  
  //     return (
  //       age >= VERIFY_MIN_AGE && 
  //       followersCount >= VERIFY_MIN_FOLLOWERS && 
  //       sessionsCount >= VERIFY_MIN_SESSIONS
  //     );
  // }

  async openActionSheet() {
    const sheet = await this.actionSheetController.create({
      header: "Settings",
      buttons: this.actionSheetButtons()
    });

    await sheet.present();
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
        this._updateUserAndVerify(data, loading);
      } else {
        this._sendValidationRequest(loading);
      }
    }
  }

  private _updateUserAndVerify(data: any, loading: HTMLIonLoadingElement) {
    const u = this.user();
    if (!u) return;

    const updatedUser = structuredClone(u);
    if (data.name) updatedUser.name = data.name;
    if (data.surname) updatedUser.surname = data.surname;
    if (data.nationality) updatedUser.nationality = data.nationality;
    if (data.birthdate) updatedUser.birthdate = data.birthdate;

    this.authService.update(updatedUser, null).subscribe({
      next: (_) => {
        this._sendValidationRequest(loading);
      },
      error: (err) => {
        loading.dismiss();
        this._showToast("Error updating info: " + (err.error?.message ?? 'Unknown'), 'danger');
      }
    });
  }

  private _sendValidationRequest(loading: HTMLIonLoadingElement) {
    this.requestService.new().subscribe({
      next: (value) => {
        loading.dismiss();
        if (value.requested) {
          this._showToast('Validation request sent successfully', 'success');
        } else {
          this._showToast(value?.message ?? '', 'danger');
        }
      },
      error: (err) => {
        loading.dismiss();
        this._showToast('Error sending request: ' + (err.error?.message ?? 'Unknown'), 'danger');
      }
    });
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

      this._updatePTInfos(data.formValue.proemail, data.formValue.gym, data.city, loading);
    }
  }

  private _updatePTInfos(proemail: string, gym: Gym, city: City, loading: HTMLIonLoadingElement) {
    if (!this.user()) return;
    const cpy = structuredClone(this.user());
    
    if (!cpy) return;

    cpy.pt = {
      proEmail: proemail,
      gym: gym,
      city: city
    }

    this.authService.update(cpy, null).subscribe({
      next: (_) => {
        loading.dismiss();
        this._showToast('Infos updated correctly!', 'success');
      },
      error: (err) => {
        loading.dismiss();
        this._showToast('Errore: ' + (err.error?.message ?? 'Unknown'), 'danger');
      }
    });
  }

  refreshProfile() {
    this.authService.refreshProfile().subscribe({
      error: (err) => {
        this._showToast("Error: " + (err.error?.message ?? 'Unknown'), 'danger');
      }
    })
  }
}
