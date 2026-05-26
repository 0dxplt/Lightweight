import { SessionExercise } from 'src/app/models/session-modal-component-info';
import { Workout, WorkoutVisualization } from "./workout.model";

export type CurrentSession = {
    nome: string;
    workout: WorkoutVisualization;
    exercises: SessionExercise[];
}