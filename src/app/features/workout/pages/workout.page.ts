import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonChip, IonImg, IonFab, IonIcon, IonFabButton, IonLabel, IonAvatar, IonItem, IonList, IonSearchbar, IonModal, IonFabList, IonSelect, IonSelectOption, IonCard, IonButton, ModalController, IonNav, IonButtons, IonBackButton, IonAlert, IonInput } from '@ionic/angular/standalone';
import { Exercise } from 'src/app/models/exercise.model';
import { ExerciseWorkout } from 'src/app/models/workout.model';
import { BetterMsViewerPipe } from "../../../shared/pipes/better-ms-viewer-pipe";
import { addIcons } from 'ionicons';
import { addCircleOutline, addOutline, checkmarkDoneOutline, closeCircleOutline, closeOutline, pencilOutline, pieChartOutline, removeCircleOutline, settingsOutline } from 'ionicons/icons';
import { ChartModalComponent } from 'src/app/shared/components/chart-modal/chart-modal.component';
import { ExerciseModalComponent } from '../components/exercise-modal/exercise-modal.component';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
  standalone: true,
  imports: [IonInput, IonCard, IonFabList, IonModal, IonSearchbar, IonList, IonItem, IonFabButton, IonIcon, IonFab, IonImg, IonChip, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BetterMsViewerPipe, IonSelect, IonSelectOption, IonButton, IonButtons, IonBackButton]
})
export class WorkoutPage implements OnInit {

  @Input() id!: string;

  @ViewChild('modal') exercisesModal!: IonModal;

  public workoutName = "Petto";

  public extendedDesc = false;

  private modalCtrl = inject(ModalController);

  public editMode = false;

  public exercises: Exercise[] = [
    {
      id: 35435345,
      name: "Panca Piana Manubri",
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
    }
  ]

  public muscleGroups = [
    "Petto",
    "Spalle",
    "Tricipiti",
    "Quadricipiti",
    "Femorali",
    "Bicipiti"
  ]

  public filteredExercises: Exercise[] = [...this.exercises];

  public exercisesWorkout: ExerciseWorkout[] = [];

  constructor() { addIcons({ settingsOutline, addOutline, pieChartOutline, pencilOutline, closeOutline, removeCircleOutline, addCircleOutline, checkmarkDoneOutline }); }


  ngOnInit() {
    console.log(this.id);
    if (!this.id) {
      console.log("Inizializzo il workout")
      // TODO: genera id e al salvataggio fai un push di tutti i dati nel database
      this.workoutName = 'Workout ' + new Date().toLocaleDateString();
      this.exercisesWorkout = [];
    } else {
      this.exercisesWorkout = [
        {
          serie: 4,
          reps: 8,
          recuperoMs: 180000,
          exercise: {
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
          }
        },
        {
          serie: 4,
          reps: 8,
          recuperoMs: 180000,
          exercise: {
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
          }
        },
        {
          serie: 4,
          reps: 8,
          recuperoMs: 180000,
          exercise: {
            id: 35435345,
            name: "Panca Piana Bialnciere",
            desc: "Pigghia na panca, un bilanciere, ti stinnigghi na panca e aisi u bilanciere.",
            imgpath: "",
            difficulty: 4,
            groups: [
              {
                muscolarGroup: { id: 3, name: "Spalle" },
                perc: 10
              },
              {
                muscolarGroup: { id: 4, name: "Bicipiti" },
                perc: 55
              }
            ]
          }
        }
      ]
    }
  }

  async inputModal(exercise: Exercise) {
    await this.exercisesModal.dismiss();
    const modal = await this.modalCtrl.create({
      component: ExerciseModalComponent,
      componentProps: {
        exercise: exercise
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.addExercise(exercise, data["serie"], data["ripetizioni"], data["recuperoMs"]);
    }
  }

  addExercise(exercise: Exercise, serie: number, ripetizioni: number, recuperoMs: number) {
    console.log(exercise, serie, ripetizioni, recuperoMs);
    this.exercisesWorkout.push(
      {
        serie: serie,
        reps: ripetizioni,
        recuperoMs: recuperoMs,
        exercise: exercise
      }
    )
  }

  filterExercises(event: any) {
    const muscularGroups = event.detail.value;
    this.filteredExercises = this.exercises.filter(ex => {
      if (muscularGroups.length === 0) {
        return true;
      }
      return ex.groups.some(tag => muscularGroups.includes(tag.muscolarGroup.name));
    })
  }

  editModeToggle() {
    this.editMode = !this.editMode;
    console.log(this.editMode);
  }

  removeExercise(exercise: ExerciseWorkout) {
    this.exercisesWorkout = this.exercisesWorkout.filter(ex => ex !== exercise);
  }

  modificaValore(exercise: any, attr: string, value: number) {
    exercise[attr] += value;
    if (exercise[attr] < 0) {
      exercise[attr] = 0;
    }
  }

  formatExercises(exercises: ExerciseWorkout[]) {
    return exercises.map(item => {
      return {
        serie: Array(item.serie).fill({ reps: item.reps }),
        tags: item.exercise.groups.map(g => ({
          nome: g.muscolarGroup.name,
          perc: g.perc
        }))
      };
    });
  }

  async visualizeRadarChart() {
    const modal = await this.modalCtrl.create({
      component: ChartModalComponent,
      initialBreakpoint: 0.53,
      breakpoints: [0, 0.53, 1.0],
      handle: true,
      componentProps: {
        exercises: this.formatExercises(this.exercisesWorkout)
      },
      cssClass: ''
    });

    await modal.present();
  }

  resetFilter() {
    this.filteredExercises = [...this.exercises];
  }

  toggleExerciseDesc(exercise: ExerciseWorkout) {
    exercise.isExpanded = !exercise.isExpanded;
  }

  updateWokoutName(event: any) {
    this.workoutName = event.target.value;
  }
}
