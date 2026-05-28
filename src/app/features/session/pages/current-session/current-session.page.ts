import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
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
import { Workout, WorkoutVisualization } from 'src/app/models/workout.model';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-session',
  templateUrl: './current-session.page.html',
  styleUrls: ['./current-session.page.scss'],
  standalone: true,
  imports: [IonItem, IonList, IonModal, IonFabList, IonFab, IonFabButton, IonSearchbar, IonButton, IonChip, IonImg, IonCard, IonBackButton, IonInput, IonButtons, IonIcon, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, BetterMsViewerPipe, IonSelect, IonSelectOption]
})
export class CurrentSessionPage implements OnInit {
  
  public modalCtrl = inject(ModalController);
  
  private authService = inject(AuthService);
  
  private router = inject(Router);
  
  @ViewChild('ricerca', { read: ElementRef, static: false }) searchBar!: ElementRef;

  public workout!: WorkoutVisualization;

  public sessionExercises: SessionExercise[] = [];

  public sessionName = "Sessione";

  public workoutExercises: Exercise[] = [];

  public filteredExercises = [...this.workoutExercises];

  public nameFilteredExercises = [...this.filteredExercises];

  public muscleGroups:string[] = [];

  public editMode = false;

  @ViewChild('modal') exercisesModal!: IonModal;

  constructor() {
    addIcons({ settingsOutline, addOutline, pieChartOutline, pencilOutline, closeOutline, removeCircleOutline, addCircleOutline, checkmarkDoneOutline });
  }

  ngOnInit() {
    const currentSessionString = localStorage.getItem("currentSession");
    if (currentSessionString) {
      const currentSession = JSON.parse(currentSessionString);
      this.sessionName = currentSession.nome;
      this.workout = currentSession.workout;
      this.sessionExercises = currentSession.exercises;
      this.workoutExercises = this.workout.exercises.map(ex => ex.exercise);
      const sessionExercisesSet = new Set(this.sessionExercises.map(ex => ex.nome));
      this.workoutExercises = this.workoutExercises.filter(ex => !sessionExercisesSet.has(ex.name));
      this.filteredExercises = [...this.workoutExercises];
      this.nameFilteredExercises = [...this.filteredExercises];
      this.muscleGroups = [
        "Petto",
        "Spalle",
        "Tricipiti",
        "Quadricipiti",
        "Femorali",
        "Bicipiti"
      ];
    }
  }

  updateSessionName(event: any) {
    this.sessionName = event.target.value;
    this.onDidEdit();
  }

  removeExercise(exercise: SessionExercise) {
    this.sessionExercises = this.sessionExercises.filter(ex => ex !== exercise);
    this.workoutExercises.push(this.adaptExercise(exercise));
    this.filteredExercises = [...this.workoutExercises];
    this.nameFilteredExercises = [...this.filteredExercises];
    this.onDidEdit();
  }

  modificaValore(serie: any, attr: string, value: number) {
    serie[attr] += value;
    if (serie[attr] < 1) {
      serie[attr] = 1;
    }
    this.onDidEdit();
  }

  onDidEdit() {
    this.authService.updateCurrentSession(
      this.sessionName,
      this.workout,
      this.sessionExercises
    );
  }

  saveSession() {
    console.log("Sessione Salvata");
    this.authService.finishCurrentSession();
    this.router.navigate(["/workouts"]);
  }

  resetFilter() {
    this.filteredExercises = [...this.workoutExercises];
    this.nameFilteredExercises = [...this.filteredExercises];
  }

  filterExercises(event: any) {
    const muscularGroups = event.detail.value;
    this.filteredExercises = this.workoutExercises.filter(ex => {
      if (muscularGroups.length === 0) {
        return true;
      }
      return ex.groups.some(tag => muscularGroups.includes(tag.muscolarGroup.name))
    });
    this.nameFilteredExercises = [...this.filteredExercises];
    if (!this.searchBar) return;
    const nodoNativo = this.searchBar.nativeElement;
    const customIonInput = new CustomEvent('ionInput', {
      detail: { value: nodoNativo.value },
      bubbles: true,
      composed: true
    });
    nodoNativo.dispatchEvent(customIonInput);
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
    this.nameFilteredExercises = [...this.filteredExercises];
    this.onDidEdit();
  }

  async inputModal(exercise: Exercise) {
    await this.exercisesModal.dismiss();
    const modal = await this.modalCtrl.create({
      component: SessionExerciseModalComponent,
      componentProps: {
        exercise: exercise,
        reps: this.workout.exercises.filter(ex => ex.exercise.name === exercise.name)[0].reps,
        recupero:  this.workout.exercises.filter(ex => ex.exercise.name === exercise.name)[0].recuperoMs
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.addExercise(exercise, data["peso"], data["ripetizioni"], data["recuperoMs"]);
    }
  }

  adaptExercise(exercise: SessionExercise): Exercise {
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
    this.onDidEdit();
  }

  removeSerie(serie: Serie, sessionExercise: SessionExercise) {
    sessionExercise.serie = sessionExercise.serie.filter(s => s !== serie);
    if (sessionExercise.serie.length < 1) {
      this.removeExercise(sessionExercise);
    } else {
      this.onDidEdit();
    }
  }

  handleInput(event: any) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.nameFilteredExercises = this.filteredExercises.filter((d) => d.name.toLowerCase().includes(query));
  }

  editModeToggle() {
    return this.editMode = !this.editMode;
  }
}
