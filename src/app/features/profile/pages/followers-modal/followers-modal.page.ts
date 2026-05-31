import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, SearchbarInputEventDetail } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { UserService } from 'src/app/shared/services/user-service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-followers-modal',
  templateUrl: './followers-modal.page.html',
  styleUrls: ['./followers-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FollowersModalPage implements OnInit {

  @Input({required: true}) username!: string; 

  private _data: User[] = [];

  followers = signal<User[] | undefined>(undefined);

  constructor(
    private userService: UserService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.userService.followersOf(this.username).subscribe(users => {
      users.forEach(u => {
        this._data.push(u);
      });
    });
    this.followers.set(this._data);
  }

  searchFollower(event: IonSearchbarCustomEvent<SearchbarInputEventDetail>) {
    const query = event.detail.value?.toLowerCase() || '';

    if (!query.trim()) {
      this.followers.set([...this._data]);
      return;
    }

    const filtered = this._data.filter(u => {
      const username = u.username.toLowerCase();
      const name = u.name?.toLowerCase() || '';
      const surname = u.surname?.toLowerCase() || '';

      return username.includes(query) || 
            name.includes(query) || 
            surname.includes(query);
    });

    this.followers.set(filtered);
  }

  visitProfile(username: string) {
    this.modalController.dismiss();
    this.router.navigate(['tabs/profile/', username]);
  }
}
