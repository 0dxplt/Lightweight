import { Exercise } from "./exercise.model";

export type SessionExercise = {
    id: number;
    exercise: Exercise;
    reps: number;
    weight: number;
    recovery: number;
    valid: boolean;
}

export type SessionExerciseMinimal = {
    exerciseId: number;
    reps: number;
    weight: number;
    recovery: number;
    valid: boolean;
}