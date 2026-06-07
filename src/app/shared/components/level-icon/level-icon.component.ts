import { Component, input, Input, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-level-icon',
  templateUrl: './level-icon.component.html',
  styleUrls: ['./level-icon.component.scss'],
})
export class LevelIconComponent  implements OnInit {

  url = input.required<string>();
  level = input.required<number>();

  constructor() {}

  ngOnInit() {}

}
