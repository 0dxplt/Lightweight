import { Component, computed, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonItemSliding } from '@ionic/angular';
import { Session } from 'src/app/models/session.model';
import { ModalController } from '@ionic/angular';
import { SessionExercise } from 'src/app/models/session-exercise.model';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-session-view-modal',
  templateUrl: './session-view-modal.page.html',
  styleUrls: ['./session-view-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SessionViewModalPage implements OnInit {

  @Input({required: true}) session!: Session;

  // Trasforma [Serie1-Panca, Serie2-Panca, Serie1-Squat] 
  // in [{name: 'Panca', sets: [Serie1, Serie2]}, {name: 'Squat', sets: [Serie1]}]
  groupedExercises = computed(() => {
    const groups: { name: string, sets: SessionExercise[] }[] = [];
    
    this.session.exercises.forEach(set => {
      let group = groups.find(g => g.name === set.exercise.name);
      if (!group) {
        group = { name: set.exercise.name, sets: [] };
        groups.push(group);
      }
      group.sets.push(set);
    });
    
    return groups;
  });

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    addIcons({
      closeOutline,
      checkmarkOutline
    })
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalController.dismiss(this.session, 'confirm');
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    })
  }

  setValidation(sessionExercise: SessionExercise, status: boolean, slidingItem: IonItemSliding) {
    sessionExercise.valid = status;
    console.log(`Esercizio ${sessionExercise.id} impostato a ${status}`);
    slidingItem.close();
  }
}
