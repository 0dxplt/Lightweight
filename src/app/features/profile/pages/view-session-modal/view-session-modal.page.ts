import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Session } from 'src/app/models/session.model';
import { DatefyPipe } from "../../../../shared/pipes/datefy-pipe";
import { BetterMsViewerPipe } from "../../../../shared/pipes/better-ms-viewer-pipe";
import { SessionExercise } from 'src/app/models/session-exercise.model';
import { addIcons } from 'ionicons';
import { lockClosedOutline, settingsOutline, shareSocialOutline, statsChart, trashOutline } from 'ionicons/icons';
import { Exercise, Serie, Tag } from 'src/app/models/session-modal-component-info';
import { ChartModalComponent } from 'src/app/shared/components/chart-modal/chart-modal.component';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-view-session-modal',
  templateUrl: './view-session-modal.page.html',
  styleUrls: ['./view-session-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DatefyPipe, BetterMsViewerPipe]
})
export class ViewSessionModalPage implements OnInit {

  @Input({required: true}) session!: Session;
  @Input({required: true}) isProfile!: boolean;

  groupedExercises = computed(() => {
    const session = this.session;
    if (!session || !session.exercises) return [];

    const groups: { name: string, sets: SessionExercise[] }[] = [];
    
    session.exercises.forEach(set => {
      let group = groups.find(g => g.name === set.exercise.name);
      if (!group) {
        group = { name: set.exercise.name, sets: [] };
        groups.push(group);
      }
      group.sets.push(set);
    });
    
    return groups;
  });

  constructor(
    private modalController: ModalController,
    private alertController: AlertController
  ) {
    addIcons({statsChart, settingsOutline, trashOutline, lockClosedOutline, shareSocialOutline});
  }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }

  private _preprocessExercises(): Exercise[] {
    const exercises: Exercise[] = [];
    
    const extractTags = (exercises: SessionExercise[]) => {
      const set: Set<{nome: string, perc: number}> = new Set<{nome: string, perc: number}>();
      exercises.forEach(e => {
        e.exercise.groups.forEach(g => {
          set.add({nome: g.muscolarGroup.name, perc: g.perc});
        })
      })
      const tags: Tag[] = [];
      set.forEach(t => tags.push(t));
      return tags;
    }
    
    const extractSeries = (exercises: SessionExercise[]) => {
      const series: Serie[] = [];
      exercises.forEach(e => {
        series.push({
          reps: e.reps,
          peso: e.weight,
          recuperoMs: e.recovery
        });
      });
      return series;
    }

    this.groupedExercises().forEach(data => {
      exercises.push({
        nome: data.name,
        tags: extractTags(data.sets),
        exercisePhotoUrl: data.sets[0].exercise.imgpath ? data.sets[0].exercise.imgpath : '',
        serie: extractSeries(data.sets)
      })
    });

    return exercises;
  }

  async openChartModal() {
    const exercises: Exercise[] = this._preprocessExercises();
    const modal = await this.modalController.create({
      component: ChartModalComponent,
      cssClass: 'chart-modal',
      initialBreakpoint: 0.4,
      breakpoints: [0, 0.4, 0.8, 1.0],
      handle: true,
      componentProps: {
        exercises: exercises
      }
    });

    await modal.present();
  }

  toggleSharing() {
    this.session.shared = !this.session.shared;
    this.modalController.dismiss(this.session, 'sharing');
  }

  getExerciseTags(sets: SessionExercise[]) {
    if (sets.length === 0) return [];
    return sets[0].exercise.groups || [];
  }

  async deleteSession() {
    const confirmAlert = await this.alertController.create({
        header: "Confirm",
        message: "Do you really want to delete \"" + this.session.workout?.name + "\"?",
        buttons: [
          {
            text: "No",
            role: "cancel"
          },
          {
            text: "Yes",
            role: "confirm"
          }
        ]
      });
      await confirmAlert.present();

      const { role } = await confirmAlert.onWillDismiss();

      if (role === 'confirm') {
        this.modalController.dismiss(this.session, 'delete');
      }
  }
}