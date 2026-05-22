import {Tag} from "./session-modal-component-info"

export type WorkoutExercise = {
    exercisePhotoUrl: string;
    nome: string;
    serie: number;
    reps: number,
    recuperoMs: number;
    tags: Tag[];
}

export type WorkoutMiniCard = {
    nome: string;
    exercises: WorkoutExercise[];
import { User } from "./user.model";
import { WorkoutExercise } from "./workout-exercise.model";

export type Workout = {
    id: number;
    creator: User;
    name: string;
    creationTimestamp: number;
    exercises: WorkoutExercise[]
}