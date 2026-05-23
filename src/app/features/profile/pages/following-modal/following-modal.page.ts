import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, SearchbarInputEventDetail } from '@ionic/angular';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user-service';

@Component({
  selector: 'app-following-modal',
  templateUrl: './following-modal.page.html',
  styleUrls: ['./following-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FollowingModalPage implements OnInit {
  
  @Input({required: true}) username!: string; 

  private _data: User[] = [];

  following = signal<User[] | undefined>(undefined);

  constructor(
    private userService: UserService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this._data = this.userService.followingOf(this.username);
    this.following.set(this._data);
  }

  searchFollower(event: IonSearchbarCustomEvent<SearchbarInputEventDetail>) {
    const query = event.detail.value?.toLowerCase() || '';

    if (!query.trim()) {
      this.following.set([...this._data]);
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

    this.following.set(filtered);
  }

  visitProfile(username: string) {
    this.modalController.dismiss();
    this.router.navigate(['tabs/profile/', username]);
  }
}
