import { Exercise } from "./exercise.model";

export type WorkoutExercise = {
    id: number;
    series: number;
    reps: number;
    exercise: Exercise;
}