import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonChip, IonFab, IonFabButton, IonIcon, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
  standalone: true,
  imports: [IonCard, IonIcon, IonFabButton, IonChip, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, RouterModule]
})
export class WorkoutsPage implements OnInit {

  public workouts = [
    {
      id: 453672547,
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

  constructor() {
    addIcons({ addOutline });
  }

  ngOnInit() {
  }

}
