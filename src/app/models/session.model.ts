import { SessionExercise, SessionExerciseMinimal } from "./session-exercise.model";
import { User } from "./user.model";
import { Workout } from "./workout.model";

export type Session = {
    id: number;
    user: User;
    workout: Workout;
    timestamp: number;
    shared: boolean;
    xp?: number
    exercises: SessionExercise[]
}

export type SaveSession = {
    nome: string,
    data_svolgimento: number,
    xp: number,
    exercises: SessionExerciseMinimal[]
}