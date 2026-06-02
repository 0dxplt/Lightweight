import { Component, computed, ElementRef, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonChip, IonImg, IonFab, IonIcon, IonFabButton, IonLabel, IonAvatar, IonItem, IonList, IonSearchbar, IonModal, IonFabList, IonSelect, IonSelectOption, IonCard, IonButton, ModalController, IonNav, IonButtons, IonBackButton, IonAlert, IonInput, IonFooter, AlertController } from '@ionic/angular/standalone';
import { Exercise } from 'src/app/models/exercise.model';
import { ExerciseWorkout, Workout, WorkoutVisualization } from 'src/app/models/workout.model';
import { BetterMsViewerPipe } from "../../../shared/pipes/better-ms-viewer-pipe";
import { addIcons } from 'ionicons';
import { addCircleOutline, addOutline, checkmarkDoneOutline, closeCircleOutline, closeOutline, pencilOutline, pieChartOutline, removeCircleOutline, saveOutline, settingsOutline, playOutline, trashOutline } from 'ionicons/icons';
import { ChartModalComponent } from 'src/app/shared/components/chart-modal/chart-modal.component';
import { ExerciseModalComponent } from '../components/exercise-modal/exercise-modal.component';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { WorkoutService } from 'src/app/shared/services/workout-service';
import { ToastController } from '@ionic/angular';
import { ExercisesService } from 'src/app/shared/services/exercises-service';
import { MuscolarGroupsService } from 'src/app/shared/services/muscolar-groups-service';

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

  private toastController = inject(ToastController);

  public exercisesService = inject(ExercisesService);

  public muscolarGroupsService = inject(MuscolarGroupsService);

  public editMode = false;

  public exercisesWorkout = signal<ExerciseWorkout[]>([]);

  public allExercises = signal<Exercise[]>([]);

  public muscleGroups = signal<string[]>([]);

  public creatorId: number = 0;

  public creatorUsername: string = "";

  public creationTimestamp = 0;

  public hasId = computed(() => this.workoutService.workoutId());

  public hasExercise = computed(() => this.exercisesWorkout().length > 0);

  public ricerca = signal<string>("");

  public selectedMuscleGroups = signal<string[]>([]);

  public exerciseVisualizer = computed(() => {
    const all = this.allExercises();
    const ricerca = this.ricerca().toLowerCase();
    const gruppi = this.selectedMuscleGroups();

    const workoutExercises = new Set(this.exercisesWorkout().map(ex => ex.exercise.id));
    return all.filter(ex => {
      if (workoutExercises.has(ex.id)) return false;

      if (ricerca && !ex.name.toLowerCase().includes(ricerca)) return false;

      if (gruppi.length > 0 && !ex.groups.some(g => gruppi.includes(g.muscolarGroup.name))) return false;

      return true;
    });
  });

  constructor() { addIcons({ closeOutline, removeCircleOutline, addCircleOutline, settingsOutline, saveOutline, trashOutline, checkmarkDoneOutline, pencilOutline, pieChartOutline, addOutline, playOutline }); }


  ngOnInit() {
    if (!this.workoutService.workoutId()) {
      console.log("Creo il workout");
      const date = new Date();
      this.workoutName = 'Workout ' + date.toLocaleDateString();
      this.creatorId = this.authService.getUser()?.id ?? 0;
      this.exercisesWorkout.set([]);
      this.creationTimestamp = date.getTime();
    } else {
      this.workoutService.full(this.workoutService.workoutId()).subscribe({
        next: (wo) => {
          this.workoutName = wo.name;
          this.creationTimestamp = wo.creationTimestamp;
          this.creatorId = wo.creatorId;
          this.creatorUsername = wo.creatorUsername;
          this.exercisesWorkout.set(wo.exercises);
        },
        error: (err) => {
          console.log(err.message);
        }
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
    this.selectedMuscleGroups.set(event.detail.value || []);
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
    this.ricerca.set('');
    this.selectedMuscleGroups.set([]);
  }

  toggleExerciseDesc(exercise: ExerciseWorkout) {
    exercise.isExpanded = !exercise.isExpanded;
  }

  updateWokoutName(event: any) {
    this.workoutName = event.target.value;
  }

  saveWorkout() {
    this.workoutService.save(this.id, this.workoutName, new Date().getTime(), this.creatorId, this.exercisesWorkout().map(
      ex => ({
        serie: ex.serie,
        ripetizioni: ex.reps,
        recupero: ex.recuperoMs,
        id: ex.exercise.id
      })
    )).subscribe({
      next: (res) => {
        this.showToast("Workout salvato con successo!", 'success', 2000);
        console.log(res.message);
        this.router.navigate(["/workouts"]);
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  async showToast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: duration
    });

    await toast.present();
  }

  fetchExercises() {
    this.exercisesService.full().subscribe({
      next: (exercises) => {
        this.allExercises.set(exercises);
      },
      error: (err) => {
        console.log(err.message);
      }
    });

    this.muscolarGroupsService.all().subscribe({
      next: (data) => {
        this.muscleGroups.set(data);
      },
      error: (err) => {
        console.log(err.message);
      }
    });
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
    this.ricerca.set(event.target.value || '');
  }

  openAddExercise() {
    this.exercisesModal.present();
  }

  deleteWorkout() {
    this.workoutService.delete(this.workoutService.workoutId()).subscribe({
      next: (res) => {
        this.showToast("Workout eliminato con successo!", 'success', 2000);
        console.log(res.message);
        this.router.navigate(["/workouts"]);
        this.workoutService.workoutId.set(null);
      },
      error: (err) => {
        console.log(err.message);
      }
    })
  }
}
