import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { UserService } from 'src/app/shared/services/user-service';
import { ProfilePageBodyComponent } from "../../components/profile-page-body/profile-page-body.component";
import { ReportService } from 'src/app/features/mod/services/report-service';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-vist-profile-page',
  templateUrl: './vist-profile-page.page.html',
  styleUrls: ['./vist-profile-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ProfilePageBodyComponent]
})
export class VistProfilePagePage implements OnInit {

  visitedUser = signal<User | null>(null);
  followed = signal<boolean>(false);
  reported = signal<boolean>(false);

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private reportService: ReportService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      
      if (!username) {
        this.location.back();
        return;
      }

      if (username === this.authService.user()?.username) {
        this.router.navigate(['/tabs/profile']);
        return;
      }

      this._loadUser(username);
    });
  }

  private _loadUser(username: string) {
    this.userService.user(username).subscribe({
      next: (user) => {
        this.visitedUser.set(user);
        this.authService.follows(user.id).subscribe({
          next: (value) => {
            this.followed.set(value);
          },
          error: (err) => {
            console.log("Errore: " + (err.error?.message ?? 'Unknown'));
          }
        })
        this.reported.set(this.reportService.exists(this.authService.user()?.id, user.id));
      },
      error: (err) => {
        console.error('Errore caricamento utente', err);
      }
    });
  }

  follow() {
    const u = this.visitedUser();
    if (!u) return;

    this.authService.follow(u.id, this.visitedUser).subscribe({
      next: (value) => {
        if (value.followed) {
          this.followed.set(true);
          this._showToast(`You have now followed ${this.visitedUser()?.username}`, 'success', 1000);
        }
      },
      error: (err) => {
        this._showToast("Errore: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
      }
    });
  }

  unfollow() {
    const u = this.visitedUser();
    if (!u) return;
    
    this.authService.unfollow(u.id, this.visitedUser).subscribe({
      next: (value) => {
        if (value.unfollowed) {
          this.followed.set(false);
          this._showToast(`You have now unfollowed ${this.visitedUser()?.username}`, 'success', 1000);
        }
      },
      error: (err) => {
        this._showToast("Errore: " + (err.error?.message ?? 'Unknown'), 'danger', 2000);
      }
    });
  }

  report() {
    const u = this.visitedUser();
    const visitor = this.authService.user();
    if (!u || !visitor) return;
    
    this._presentAlert(visitor, u);
  }

  private async _presentAlert(reporter: User, reportee: User) {
    const alert = await this.alertController.create({
      header: 'Reason',
      message: 'Insert the reason in order to report \"' + reportee.username + "\"",
      buttons: [
        {
          text: 'Cancel',
          role: "cancel",
        },
        {
          text: 'Confirm',
          role: 'confirm',
        }
      ],
      inputs: [{
        name: 'reason',
        type: 'text',
        attributes: {
          autocomplete: 'off',
        },
        placeholder: "Reason...",
      }],
    });

    await alert.present();

    const { data, role } = await alert.onWillDismiss();

    if (role === 'confirm' && data?.values?.reason) {
      const reason = data.values.reason;
      
      const loading = await this.loadingController.create({
        message: "Wait a moment please...",
      });
      await loading.present();

      // da sostituire con Observable/Promise quando avremo il backend
      setTimeout(() => {
        loading.dismiss();
        this.reportService.report(reporter.id, reportee.id, reason);
        this._showToast('Report sent successfully', 'success', 2000);
        this.reported.set(true);
      }, 500);
      
    } else if (role === 'confirm' && !data?.values?.reason) {
      this._showToast('You must provide a reason', 'danger', 2000);
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
