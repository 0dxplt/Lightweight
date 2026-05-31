import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonChip, IonFab, IonFabButton, IonIcon, IonCard, ViewDidEnter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { WorkoutMiniCard } from 'src/app/models/workout-mini-card.model';
import { AuthService } from 'src/app/features/auth/services/auth-service';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
  standalone: true,
  imports: [IonCard, IonIcon, IonFabButton, IonChip, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, RouterModule]
})
export class WorkoutsPage implements OnInit {

  public workouts: WorkoutMiniCard[] = [];

  public sessionName = null;

  public authService = inject(AuthService);

  constructor() {
    addIcons({ addOutline });
  }

  ngOnInit() {
    //fetch al database per ottenere i dati
    this.workouts = [
      {
        id: 1,
        nome: "Petto",
        tags: [
          "Petto",
          "Tricipiti",
          "Quadricipiti"
        ]
      },
      {
        id: 2,
        nome: "Petto",
        tags: [
          "Petto",
          "Tricipiti",
          "Quadricipiti"
        ]
      },
      {
        id: 453672547,
        nome: "Petto",
        tags: [
          "Petto",
          "Tricipiti",
          "Quadricipiti"
        ]
      }
    ];

    const currentSessionString = localStorage.getItem("currentSession");
    if (currentSessionString) {
      const currentSession = JSON.parse(currentSessionString);
      this.sessionName = currentSession.nome;
    }
  }


}
