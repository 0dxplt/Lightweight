import { Component, computed, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonInput, IonBackButton, IonCard, IonImg, IonChip, IonButton, IonSearchbar, IonFabButton, IonFab, IonFabList, IonModal, IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Serie, SessionExercise } from 'src/app/models/session-modal-component-info';
import { BetterMsViewerPipe } from "../../../../shared/pipes/better-ms-viewer-pipe";
import { Exercise } from 'src/app/models/exercise.model';
import { ModalController } from '@ionic/angular/standalone';
import { SessionExerciseModalComponent } from '../../components/session-exercise-modal/session-exercise-modal.component';
import { addIcons } from 'ionicons';
import { addCircleOutline, addOutline, checkmarkDoneOutline, closeOutline, pencilOutline, pieChartOutline, removeCircleOutline, settingsOutline } from 'ionicons/icons';
import { WorkoutVisualization } from 'src/app/models/workout.model';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { Router } from '@angular/router';
import { MuscolarGroupsService } from 'src/app/shared/services/muscolar-groups-service';
import { SaveSession } from 'src/app/models/session.model';

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

  private muscleGroupService = inject(MuscolarGroupsService);

  public workout = signal<WorkoutVisualization | null>(null);

  public sessionExercises = signal<SessionExercise[]>([]);

  public sessionName = signal<string>("");

  public editMode = signal<boolean>(false);

  public ricerca = signal<string>('');

  public selectedMuscleGroups = signal<string[]>([]);

  public muscleGroups = signal<string[]>([]);

  public xp = signal<number>(0);

  public workoutExercises = computed(() => {
    const wo = this.workout();
    if (!wo) return [];
    return wo.exercises.map(ex => ex.exercise);
  });

  public exercisesVisualizer = computed(() => {
    const exercises = this.workoutExercises();
    const ricerca = this.ricerca().toLowerCase();
    const groups = this.selectedMuscleGroups();

    const sessionExercises = new Set(this.sessionExercises().map(ex => ex.nome));

    return exercises.filter(ex => {
      if (sessionExercises.has(ex.name)) return false;

      if (ricerca && !ex.name.toLowerCase().includes(ricerca)) return false;

      if (groups.length > 0 && !ex.groups.some(g => groups.includes(g.muscolarGroup.name))) return false;

      return true;
    })
  })

  @ViewChild('modal') exercisesModal!: IonModal;

  constructor() {
    addIcons({ settingsOutline, addOutline, pieChartOutline, pencilOutline, closeOutline, removeCircleOutline, addCircleOutline, checkmarkDoneOutline });

    effect(() => {
      const wo = this.workout();
      if (wo) {
        this.authService.updateCurrentSession(
          this.sessionName(),
          wo,
          this.sessionExercises()
        );
      }
    });
  }

  ngOnInit() {
    const currentSessionString = localStorage.getItem("currentSession");
    if (currentSessionString) {
      const currentSession = JSON.parse(currentSessionString);
      this.sessionName.set(currentSession.nome);
      this.workout.set(currentSession.workout);
      this.sessionExercises.set(currentSession.exercises);
      this.muscleGroupService.all().subscribe({
        next: (data) => {
          this.muscleGroups.set(data);
        },
        error: (err) => {
          console.log(err.message);
        }
      });
    }
  }

  updateSessionName(event: any) {
    this.sessionName.set(event.target.value);
  }

  removeExercise(exercise: SessionExercise) {
    this.sessionExercises.update(exercises =>
      exercises.filter(ex => ex !== exercise)
    );
  }

  modificaValore(serie: any, attr: string, value: number) {
    this.sessionExercises.update(esercizi => {
      serie[attr] += value;
      if (serie[attr] < 1) serie[attr] = 1;
      return [...esercizi];
    });
  }

  saveSession() {
    const session: SaveSession = {
      nome: this.sessionName(),
      dataSvolgimento: new Date().getTime(),
      xp: this.xp(),
      exercises: this.sessionExercises().flatMap(ex => {
        const exercise = this.workoutExercises().find(excs => excs.name === ex.nome);
        return ex.serie.map(s => ({
          exerciseId: exercise!.id,
          reps: s.reps,
          weight: s.peso,
          recovery: s.recuperoMs,
          valid: true
        }));
      })
    };
    this.authService.finishCurrentSession(session).subscribe({
      next: () => {
        this.router.navigate(["/workouts"]);
      },
      error: (err) => {
        console.error("Errore nel salvataggio della sessione: ", err);
      }
    });
  }

  resetFilter() {
    this.ricerca.set('');
    this.selectedMuscleGroups.set([]);
  }

  filterExercises(event: any) {
    this.selectedMuscleGroups.set(event.detail.value || []);
  }

  addExercise(exercise: Exercise, peso: number, ripetizioni: number, recuperoMs: number) {
    this.sessionExercises.update(esercizi => [...esercizi, {
      exercisePhotoUrl: (exercise.imgpath) ? exercise.imgpath : "",
      nome: exercise.name,
      serie: [{ peso: peso, reps: ripetizioni, recuperoMs: recuperoMs }],
      tags: exercise.groups.map(g => ({ nome: g.muscolarGroup.name, perc: g.perc }))
    }]);
  }

  async inputModal(exercise: Exercise) {
    await this.exercisesModal.dismiss();
    const modal = await this.modalCtrl.create({
      component: SessionExerciseModalComponent,
      componentProps: {
        exercise: exercise,
        reps: this.workout()?.exercises.filter(ex => ex.exercise.name === exercise.name)[0].reps || 10,
        recupero: this.workout()?.exercises.filter(ex => ex.exercise.name === exercise.name)[0].recuperoMs || 180000
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.addExercise(exercise, data["peso"], data["ripetizioni"], data["recuperoMs"]);
    }
  }

  adaptExercise(exercise: SessionExercise): Exercise {
    const fullExercise = this.workoutExercises().find(ex => ex.name === exercise.nome);
    if (fullExercise) {
      return fullExercise;
    } else {
      throw new Error("Esercizio non trovato. Errore di Sistema!!");
    }
  }

  async addSerie(exercise: SessionExercise) {
    await this.exercisesModal.dismiss();
    const modal = await this.modalCtrl.create({
      component: SessionExerciseModalComponent,
      componentProps: {
        exercise: this.adaptExercise(exercise),
        reps: exercise.serie[0].reps,
        recupero: exercise.serie[0].recuperoMs
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.sessionExercises.update(esercizi => {
        const target = esercizi.find(e => e === exercise);
        if (target) {
          target.serie.push({ peso: data["peso"], reps: data["ripetizioni"], recuperoMs: data["recuperoMs"] });
        }
        return [...esercizi];
      });
    }
  }

  removeSerie(serie: Serie, sessionExercise: SessionExercise) {
    this.sessionExercises.update(esercizi => {
      const target = esercizi.find(e => e === sessionExercise);
      if (target) {
        target.serie = target.serie.filter(s => s !== serie);
        if (target.serie.length < 1) {
          return esercizi.filter(e => e !== sessionExercise);
        }
      }
      return [...esercizi];
    });
  }

  handleInput(event: any) {
    this.ricerca.set(event.target.value || '');
  }

  editModeToggle() {
    this.editMode.update(v => !v);
  }
}
