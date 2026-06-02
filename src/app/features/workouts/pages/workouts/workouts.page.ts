import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonChip, IonFab, IonFabButton, IonIcon, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { WorkoutMiniCard } from 'src/app/models/workout-mini-card.model';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { WorkoutsService } from 'src/app/shared/services/workouts-service';
import { filter, Subscription } from 'rxjs';
import { WorkoutService } from 'src/app/shared/services/workout-service';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
  standalone: true,
  imports: [IonCard, IonIcon, IonFabButton, IonChip, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, RouterModule]
})
export class WorkoutsPage implements OnInit, OnDestroy{

  public workouts = signal<WorkoutMiniCard[]>([]);

  public sessionName = null;

  public authService = inject(AuthService);

  private workoutsService = inject(WorkoutsService);
  private workoutService = inject(WorkoutService);

  private router = inject(Router);

  private routerSubscription?: Subscription;

  constructor() {
    addIcons({ addOutline });
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.router.url.startsWith('/tabs/workouts')) {
          this.fetchWorkouts();
        }
      });
    this.fetchWorkouts();
    const currentSessionString = localStorage.getItem("currentSession");
    if (currentSessionString) {
      const currentSession = JSON.parse(currentSessionString);
      this.sessionName = currentSession.nome;
    }
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  fetchWorkouts() {
    this.workoutsService.get().subscribe({
      next: (workouts) => {
        this.workouts.set(workouts);
      },
      error: (err) => {
        console.error("Errore nel recupero dei workout: ", err);
      }
    });
  }

  goToWorkout(id: number | null) {
    this.workoutService.workoutId.set(id);
    this.router.navigate(["/workout"]);
  }
}