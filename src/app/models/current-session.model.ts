import { SessionExercise } from 'src/app/models/session-modal-component-info';
import { Workout } from "./workout.model";

export type CurrentSession = {
    nome: string;
    workout: Workout;
    exercises: SessionExercise[];
}