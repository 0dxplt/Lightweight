import { Component, computed, OnInit, output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Session } from 'src/app/models/session.model';
import { input } from '@angular/core';
import { addIcons } from 'ionicons';
import { calendarOutline, flashOutline, lockClosedOutline, shareSocialOutline } from 'ionicons/icons';
import { DatefyPipe } from "../../../../shared/pipes/datefy-pipe";
import { ModalController } from '@ionic/angular/standalone';
import { SessionViewModalPage } from '../../pages/session-view-modal/session-view-modal.page';

@Component({
  selector: 'app-session-card',
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.scss'],
  imports: [IonicModule, DatefyPipe]
})
export class SessionCardComponent  implements OnInit {

  session = input.required<Session>();
  onClick = output<Session>();

  uniqueTags = computed(() => {
    const tags = new Set<string>();
    this.session().exercises.forEach(e => {
      e.exercise.groups.forEach(g => tags.add(g.muscolarGroup.name));
    });
    return Array.from(tags);
  });

  constructor() {
    addIcons({ 
      calendarOutline, 
      shareSocialOutline, 
      flashOutline, 
      lockClosedOutline 
    });
  }

  ngOnInit() {}

  click() {
    this.onClick.emit(this.session());
  }
}
