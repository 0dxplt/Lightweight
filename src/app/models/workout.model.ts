import { Tag } from "./session-modal-component-info"
import { User } from "./user.model";
import { WorkoutExercise } from "./workout-exercise.model";

export type ExerciseWorkout = {
    exercisePhotoUrl: string;
    nome: string;
    serie: number;
    reps: number,
    recuperoMs: number;
    tags: Tag[];
}

export type WorkoutMiniCard = {
    nome: string;
    exercises: ExerciseWorkout[];
}

export type Workout = {
    id: number;
    creator: User;
    name: string;
    creationTimestamp: number;
    exercises: WorkoutExercise[]
}