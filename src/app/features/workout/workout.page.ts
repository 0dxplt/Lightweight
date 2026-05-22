import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonChip, IonImg, IonFab, IonIcon, IonFabButton, IonLabel, IonAvatar, IonItem, IonList, IonSearchbar, IonModal, IonFabList } from '@ionic/angular/standalone';
import { Exercise } from 'src/app/models/session-modal-component-info';
import { ExerciseWorkout } from 'src/app/models/workout.model';
import { BetterMsViewerPipe } from "../../shared/pipes/better-ms-viewer-pipe";
import { addIcons } from 'ionicons';
import { addOutline, pieChartOutline, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
  standalone: true,
  imports: [IonFabList, IonModal, IonSearchbar, IonList, IonItem, IonAvatar, IonLabel, IonFabButton, IonIcon, IonFab, IonImg, IonChip, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BetterMsViewerPipe]
})
export class WorkoutPage implements OnInit {

  @Input() id!: string;

  public exercises:ExerciseWorkout[] = [
    {
      exercisePhotoUrl: "",
      nome: "Panca Piana Manubri",
      serie: 4,
      reps: 8,
      recuperoMs: 180000,
      tags: [
        {
          nome: "Petto",
          perc: 55,
        },
        {
          nome: "Spalle",
          perc: 25,
        },
        {
          nome: "Tricipiti",
          perc: 20,
        },
      ]
    },
    {
      exercisePhotoUrl: "",
      nome: "Panca Piana Manubri",
      serie: 4,
      reps: 8,
      recuperoMs: 180000,
      tags: [
        {
          nome: "Petto",
          perc: 55,
        },
        {
          nome: "Spalle",
          perc: 25,
        },
        {
          nome: "Tricipiti",
          perc: 20,
        },
      ]
    },
    {
      exercisePhotoUrl: "",
      nome: "Panca Piana Manubri",
      serie: 4,
      reps: 8,
      recuperoMs: 180000,
      tags: [
        {
          nome: "Petto",
          perc: 55,
        },
        {
          nome: "Spalle",
          perc: 25,
        },
        {
          nome: "Tricipiti",
          perc: 20,
        }
      ]
    }
  ];

  constructor() { addIcons({addOutline, settingsOutline, pieChartOutline})}


  ngOnInit() {
    console.log(this.id);
    if (!this.id) {
      console.log("Inizializzo il workout")
      // TODO: genera id e al salvataggio fai un push di tutti i dati nel database
      this.exercises = [];
    }
  }
}
