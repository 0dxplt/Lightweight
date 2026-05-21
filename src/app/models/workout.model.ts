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
}