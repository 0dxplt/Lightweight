import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonChip, IonImg, IonFab, IonIcon, IonFabButton, IonLabel, IonAvatar, IonItem, IonList, IonSearchbar, IonModal, IonFabList, IonSelect, IonSelectOption, IonCard, IonButton } from '@ionic/angular/standalone';
import { Exercise } from 'src/app/models/exercise.model';
import { ExerciseWorkout } from 'src/app/models/workout.model';
import { BetterMsViewerPipe } from "../../shared/pipes/better-ms-viewer-pipe";
import { addIcons } from 'ionicons';
import { addCircleOutline, addOutline, closeCircleOutline, closeOutline, pencilOutline, pieChartOutline, removeCircleOutline, settingsOutline } from 'ionicons/icons';
import { MuscolarGroup } from 'src/app/models/muscolar-group.model';
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
  standalone: true,
  imports: [IonCard, IonFabList, IonModal, IonSearchbar, IonList, IonItem, IonFabButton, IonIcon, IonFab, IonImg, IonChip, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BetterMsViewerPipe, IonSelect, IonSelectOption, IonButton]
})
export class WorkoutPage implements OnInit {

  @Input() id!: string;

  public editMode = false;

  public exercises: Exercise[] = [
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
          muscolarGroup: { id: 1, name: "Petto" },
          perc: 55
        },
        {
          muscolarGroup: { id: 1, name: "Petto" },
          perc: 55
        },
        {
          muscolarGroup: { id: 1, name: "Petto" },
          perc: 55
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
          muscolarGroup: { id: 1, name: "Petto" },
          perc: 55
        },
        {
          muscolarGroup: { id: 1, name: "Petto" },
          perc: 55
        },
        {
          muscolarGroup: { id: 1, name: "Petto" },
          perc: 55
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

  public exercisesWorkout: ExerciseWorkout[] = [
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
            muscolarGroup: { id: 1, name: "Petto" },
            perc: 55
          },
          {
            muscolarGroup: { id: 1, name: "Petto" },
            perc: 55
          },
          {
            muscolarGroup: { id: 1, name: "Petto" },
            perc: 55
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
            muscolarGroup: { id: 1, name: "Petto" },
            perc: 55
          },
          {
            muscolarGroup: { id: 1, name: "Petto" },
            perc: 55
          },
          {
            muscolarGroup: { id: 1, name: "Petto" },
            perc: 55
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
            muscolarGroup: { id: 1, name: "Petto" },
            perc: 55
          },
          {
            muscolarGroup: { id: 1, name: "Petto" },
            perc: 55
          },
          {
            muscolarGroup: { id: 1, name: "Petto" },
            perc: 55
          }
        ]
      }
    }
  ];

  constructor() { addIcons({ settingsOutline, addOutline, pieChartOutline, pencilOutline, closeOutline, removeCircleOutline, addCircleOutline }); }


  ngOnInit() {
    console.log(this.id);
    if (!this.id) {
      console.log("Inizializzo il workout")
      // TODO: genera id e al salvataggio fai un push di tutti i dati nel database
      this.exercises = [];
    }
  }

  addExercise(exercise: Exercise) {
    console.log(exercise);
    this.exercisesWorkout.push(
      {
        serie: 4,
        reps: 3,
        recuperoMs: 180000,
        exercise: exercise
      }
    )
  }

  filterExercises(event: any) {
    const muscularGroups = event.detail.value;
    console.log(muscularGroups);
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
}
