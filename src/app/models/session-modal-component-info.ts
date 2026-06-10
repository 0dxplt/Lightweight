export type Serie = {
    peso: number;
    reps: number;
    recuperoMs: number;
}

export type Tag = {
    nome: string;
    perc: number;
}

export type SessionExercise = {
    exercisePhotoUrl: string;
    nome: string;
    serie: Serie[];
    tags: Tag[];
}

export type SessionModalComponentInfo = {
    nome: string;
    timestamp: number;
    exercises: SessionExercise[];
    xp: number;
}