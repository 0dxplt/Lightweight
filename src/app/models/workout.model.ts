import { Exercise } from "./exercise.model";
import { User } from "./user.model";
import { WorkoutExercise } from "./workout-exercise.model";

export type ExerciseWorkout = {
    serie: number;
    reps: number,
    recuperoMs: number;
    exercise: Exercise;
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