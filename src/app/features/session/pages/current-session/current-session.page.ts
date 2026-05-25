import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonInput, IonBackButton, IonCard, IonImg, IonChip, IonButton, IonSearchbar, IonFabButton, IonFab, IonFabList, IonModal, IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { SessionModalComponent } from 'src/app/shared/components/session-modal/session-modal.component';
import { Serie, SessionExercise } from 'src/app/models/session-modal-component-info';
import { BetterMsViewerPipe } from "../../../../shared/pipes/better-ms-viewer-pipe";
import { Exercise } from 'src/app/models/exercise.model';
import { ModalController } from '@ionic/angular/standalone';
import { ExerciseModalComponent } from 'src/app/features/workout/components/exercise-modal/exercise-modal.component';
import { SessionExerciseModalComponent } from '../../components/session-exercise-modal/session-exercise-modal.component';
import { addIcons } from 'ionicons';
import { addCircleOutline, addOutline, checkmarkDoneOutline, closeOutline, pencilOutline, pieChartOutline, removeCircleOutline, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-current-session',
  templateUrl: './current-session.page.html',
  styleUrls: ['./current-session.page.scss'],
  standalone: true,
  imports: [IonItem, IonList, IonModal, IonFabList, IonFab, IonFabButton, IonSearchbar, IonButton, IonChip, IonImg, IonCard, IonBackButton, IonInput, IonButtons, IonIcon, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, BetterMsViewerPipe, IonSelect, IonSelectOption]
})
export class CurrentSessionPage implements OnInit {

  public modalCtrl = inject(ModalController);

  public sessionExercises: SessionExercise[] = [];

  public sessionName = "Sessione";

  public workoutExercises: Exercise[] = [
    {
      id: 35435345,
      name: "Panca Piana Manubri Bilanciere Sdraiato",
      desc: "Pigghia na panca, un bilanciere, ti stinnigghi na panca e aisi u bilanciere.",
      imgpath: "https://static.strengthlevel.com/images/exercises/dumbbell-bench-press/dumbbell-bench-press-800.jpg",
      difficulty: 4,
      groups: [
        {
          muscolarGroup: { id: 1, name: "Petto" },
          perc: 55
        },
        {
          muscolarGroup: { id: 2, name: "Tricipiti" },
          perc: 20
        },
        {
          muscolarGroup: { id: 3, name: "Spalle" },
          perc: 10
        },
        {
          muscolarGroup: { id: 4, name: "Bicipiti" },
          perc: 15
        }
      ]
    },
    {
      id: 35435345,
      name: "Panca Piana Bialnciere",
      desc: "Pigghia na panca, un bilanciere, ti stinnigghi na panca e aisi u bilanciere.",
      imgpath: "",
      difficulty: 4,
      groups: [
        {
          muscolarGroup: { id: 1, name: "Petto" },
          perc: 55
        },
        {
          muscolarGroup: { id: 2, name: "Tricipiti" },
          perc: 20
        },
        {
          muscolarGroup: { id: 3, name: "Spalle" },
          perc: 10
        },
        {
          muscolarGroup: { id: 4, name: "Bicipiti" },
          perc: 15
        }
      ]
    },
    {
      id: 35435345,
      name: "Pressa 45",
      desc: "Pigghia na panca, un bilanciere, ti stinnigghi na panca e aisi u bilanciere.",
      imgpath: "",
      difficulty: 4,
      groups: [
        {
          muscolarGroup: { id: 5, name: "Femorali" },
          perc: 65
        },
        {
          muscolarGroup: { id: 6, name: "Quadricipiti" },
          perc: 35
        }
      ]
    },
    {
      id: 35435345,
      name: "Panca Piana Manubri Bilanciere Sdraiato",
      desc: "Pigghia na panca, un bilanciere, ti stinnigghi na panca e aisi u bilanciere.",
      imgpath: "https://static.strengthlevel.com/images/exercises/dumbbell-bench-press/dumbbell-bench-press-800.jpg",
      difficulty: 4,
      groups: [
        {
          muscolarGroup: { id: 1, name: "Petto" },
          perc: 55
        },
        {
          muscolarGroup: { id: 2, name: "Tricipiti" },
          perc: 20
        },
        {
          muscolarGroup: { id: 3, name: "Spalle" },
          perc: 10
        },
        {
          muscolarGroup: { id: 4, name: "Bicipiti" },
          perc: 15
        }
      ]
    },
  ];

  public filteredExercises = [...this.workoutExercises];

  public muscleGroups = [
    "Petto",
    "Spalle",
    "Tricipiti",
    "Quadricipiti",
    "Femorali",
    "Bicipiti"
  ]

  @ViewChild('modal') exercisesModal!: IonModal;

  constructor() { addIcons({ settingsOutline, addOutline, pieChartOutline, pencilOutline, closeOutline, removeCircleOutline, addCircleOutline, checkmarkDoneOutline }); }

  ngOnInit() {
  }

  updateSessionName(event: any) {
    this.sessionName = event.target.value;
  }

  removeExercise(exercise: SessionExercise) {
    this.sessionExercises = this.sessionExercises.filter(ex => ex !== exercise);
    this.workoutExercises.push(this.adaptExercise(exercise));
    this.filteredExercises = [...this.workoutExercises];
  }

  modificaValore(serie: any, attr: string, value: number) {
    serie[attr] += value;
    if (serie[attr] < 1) {
      serie[attr] = 1;
    }
  }

  saveSession() {
    console.log("Sessione salvata");
  }

  resetFilter() {
    this.filteredExercises = [...this.workoutExercises];
  }

  filterExercises(event: any) {
    const muscularGroups = event.detail.value;
    this.filteredExercises = this.workoutExercises.filter(ex => {
      if (muscularGroups.length === 0) {
        return true;
      }
      return ex.groups.some(tag => muscularGroups.includes(tag.muscolarGroup.name));
    })
  }

  addExercise(exercise: Exercise, peso: number, ripetizioni: number, recuperoMs: number) {
    this.sessionExercises.push({
      exercisePhotoUrl: (exercise.imgpath) ? exercise.imgpath : "",
      nome: exercise.name,
      serie: [
        {
          peso: peso,
          reps: ripetizioni,
          recuperoMs: recuperoMs
        }
      ],
      tags: exercise.groups.map(g => ({
        nome: g.muscolarGroup.name,
        perc: g.perc
      }))
    });
    this.workoutExercises = this.workoutExercises.filter(ex => ex !== exercise);
    this.filteredExercises = [...this.workoutExercises];
  }

  async inputModal(exercise: Exercise) {
    await this.exercisesModal.dismiss();
    const modal = await this.modalCtrl.create({
      component: SessionExerciseModalComponent,
      componentProps: {
        exercise: exercise
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.addExercise(exercise, data["peso"], data["ripetizioni"], data["recuperoMs"]);
    }
  }

  adaptExercise(exercise: SessionExercise):Exercise {
    // TODO: fetch al db tramite exercise.nome
    return {
      id: 0,
      name: exercise.nome,
      desc: "Pigghi a panca",
      imgpath: exercise.exercisePhotoUrl,
      difficulty: 4,
      groups: [
        {
          muscolarGroup: {
            id: 1,
            name: "Petto"
          },
          perc: 100
        }
      ]
    }
  }

  async addSerie(exercise: SessionExercise) {
    await this.exercisesModal.dismiss();
    const modal = await this.modalCtrl.create({
      component: SessionExerciseModalComponent,
      componentProps: {
        exercise: this.adaptExercise(exercise)
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      exercise.serie.push({
        peso: data["peso"],
        reps: data["ripetizioni"],
        recuperoMs: data["recuperoMs"]
      })
    }
  }

  removeSerie(serie: Serie, sessionExercise: SessionExercise) {
    sessionExercise.serie = sessionExercise.serie.filter(s => s !== serie);
    if (sessionExercise.serie.length < 1) {
      this.removeExercise(sessionExercise);
    }
  }

}
