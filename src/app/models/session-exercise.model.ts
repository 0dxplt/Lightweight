import { Exercise } from "./exercise.model";

export type SessionExercise = {
    id: number;
    exercise: Exercise;
    reps: number;
    weight: number;
    valid: boolean;
}