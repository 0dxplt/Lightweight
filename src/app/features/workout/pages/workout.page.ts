import { Component, computed, ElementRef, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonChip, IonImg, IonFab, IonIcon, IonFabButton, IonLabel, IonAvatar, IonItem, IonList, IonSearchbar, IonModal, IonFabList, IonSelect, IonSelectOption, IonCard, IonButton, ModalController, IonNav, IonButtons, IonBackButton, IonAlert, IonInput, IonFooter, AlertController } from '@ionic/angular/standalone';
import { Exercise } from 'src/app/models/exercise.model';
import { ExerciseWorkout, Workout, WorkoutVisualization } from 'src/app/models/workout.model';
import { BetterMsViewerPipe } from "../../../shared/pipes/better-ms-viewer-pipe";
import { addIcons } from 'ionicons';
import { addCircleOutline, addOutline, checkmarkDoneOutline, closeCircleOutline, closeOutline, pencilOutline, pieChartOutline, removeCircleOutline, saveOutline, settingsOutline, playOutline } from 'ionicons/icons';
import { ChartModalComponent } from 'src/app/shared/components/chart-modal/chart-modal.component';
import { ExerciseModalComponent } from '../components/exercise-modal/exercise-modal.component';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { WorkoutService } from 'src/app/shared/services/workout-service';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
  standalone: true,
  imports: [IonInput, IonCard, IonFabList, IonModal, IonSearchbar, IonList, IonItem, IonFabButton, IonIcon, IonFab, IonImg, IonChip, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BetterMsViewerPipe, IonSelect, IonSelectOption, IonButton, IonButtons, IonBackButton]
})
export class WorkoutPage implements OnInit {

  @Input() id!: number;

  @ViewChild('modal') exercisesModal!: IonModal;
  @ViewChild('ricerca', { read: ElementRef, static: false }) searchBar!: ElementRef;

  public workoutName: string = "";

  public extendedDesc = false;

  private modalCtrl = inject(ModalController);

  private router = inject(Router);

  private authService = inject(AuthService);

  private alertController = inject(AlertController);

  private workoutService = inject(WorkoutService);

  public editMode = false;

  public exercises: Exercise[] = [];

  public muscleGroups: string[] = [];

  public filteredExercises: Exercise[] = [];

  public nameFilteredExercises: Exercise[] = [];

  public exercisesWorkout = signal<ExerciseWorkout[]>([]);

  public creatorId: number = 0;
  public creatorUsername: string = "";

  public creationTimestamp = 0;

  public hasExercise = computed(() => this.exercisesWorkout().length > 0);

  constructor() { addIcons({ closeOutline, removeCircleOutline, addCircleOutline, settingsOutline, addOutline, saveOutline, checkmarkDoneOutline, pencilOutline, pieChartOutline, playOutline }); }


  ngOnInit() {
    console.log(this.id);
    if (!this.id) {
      console.log("Creo il workout");
      const date = new Date();
      this.workoutName = 'Workout ' + date.toLocaleDateString();
      this.exercisesWorkout.set([]);
      this.creationTimestamp = date.getDate();
    } else {
      //TODO: fetch per ottenere tutti i dati del workout
      this.workoutService.full(this.id).subscribe(wo => {
        this.workoutName = wo.name;
        this.creationTimestamp = wo.creationTimestamp;
        this.creatorId = wo.creatorId;
        this.creatorUsername = wo.creatorUsername;
        this.exercisesWorkout.set(wo.exercises);
      });
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
    this.exercisesWorkout.update((values) => [...values, {
      serie: serie,
      reps: ripetizioni,
      recuperoMs: recuperoMs,
      exercise: exercise
    }]);
  }

  filterExercises(event: any) {
    const muscularGroups = event.detail.value;
    this.filteredExercises = this.exercises.filter(ex => {
      if (muscularGroups.length === 0) {
        return true;
      }
      return ex.groups.some(tag => muscularGroups.includes(tag.muscolarGroup.name));
    })
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

  editModeToggle() {
    this.editMode = !this.editMode;
    console.log(this.editMode);
  }

  removeExercise(exercise: ExerciseWorkout) {
    this.exercisesWorkout.update((values) => values.filter(ex => ex !== exercise));
  }

  modificaValore(exercise: any, attr: string, value: number) {
    exercise[attr] += value;
    if (exercise[attr] < 1) {
      exercise[attr] = 1;
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
        exercises: this.formatExercises(this.exercisesWorkout())
      },
      cssClass: ''
    });

    await modal.present();
  }

  resetFilter() {
    this.filteredExercises = [...this.exercises];
    this.nameFilteredExercises = [...this.filteredExercises];
  }

  toggleExerciseDesc(exercise: ExerciseWorkout) {
    exercise.isExpanded = !exercise.isExpanded;
  }

  updateWokoutName(event: any) {
    this.workoutName = event.target.value;
  }

  saveWorkout() {
    this.workoutService.save(this.id, this.workoutName, new Date().getDate(), this.creatorId, this.exercisesWorkout().map(
      ex => ({
        serie: ex.serie,
        ripetizioni: ex.reps,
        recupero: ex.recuperoMs,
        id: ex.exercise.id
      })
    )).subscribe({
      next: (res) => {
        console.log(res.message);
      },
      error: (err) => {
        console.log(err.message);
      }
    });
    this.router.navigate(["/workouts"]);
  }

  fetchExercises() {
    // TODO: fetch al db per ottenere tutti gli esercizi
    const fetchedExercises = [
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
    ];

    const exercisesWorkoutSet = new Set(this.exercisesWorkout().map(ex => ex.exercise.name));

    this.exercises = fetchedExercises.filter(ex => !exercisesWorkoutSet.has(ex.name));

    this.filteredExercises = [...this.exercises];
    this.nameFilteredExercises = [...this.filteredExercises];

    // TODO: fetch per ottenere tutti i gruppi muscolari
    this.muscleGroups = [
      "Petto",
      "Spalle",
      "Tricipiti",
      "Quadricipiti",
      "Femorali",
      "Bicipiti"
    ];
  }

  createCurrentSession() {
    const workout: WorkoutVisualization = {
      id: this.id,
      creatorUsername: this.creatorUsername,
      creatorId: this.creatorId,
      name: this.workoutName,
      creationTimestamp: this.creationTimestamp,
      exercises: this.exercisesWorkout()
    };
    this.authService.createCurrentSession(workout);
    this.router.navigate(["/session"]);
  }

  async startSessionWorkout() {
    if (!this.authService.currentSession()) {
      this.createCurrentSession();
    } else {
      const alertButtons = [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Alert canceled');
        },
      },
      {
        text: 'Confirm',
        role: 'confirm',
        handler: () => {
          this.createCurrentSession();
        },
      }];

      const alert = await this.alertController.create({
        header: 'Hai già una sessione attiva!',
        subHeader: "Vuoi sovrascrivere la sessione corrente?",
        buttons: alertButtons,
      });

      await alert.present();
    }
  }

  handleInput(event: any) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.nameFilteredExercises = this.filteredExercises.filter((d) => d.name.toLowerCase().includes(query));
  }
}
