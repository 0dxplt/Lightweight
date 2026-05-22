import { Component, model, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile-page-body',
  templateUrl: './profile-page-body.component.html',
  styleUrls: ['./profile-page-body.component.scss'],
})
export class ProfilePageBodyComponent  implements OnInit {

  user = model.required<User | null>();

  constructor(private router: Router) { }

  ngOnInit() {
    if (!this.user()) this.router.navigate(["login"]);
  }

}
