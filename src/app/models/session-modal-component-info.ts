export type Serie = {
    peso: number;
    reps: number;
    recuperoMs: number;
}

export type Exercise = {
    exercisePhotoUrl: string;
    nome: string;
    serie: Serie[];
    tags: String[];
}

export type SessionModalComponentInfo = {
    nome: string;
    timestamp: number;
    exercises: Exercise[];
}