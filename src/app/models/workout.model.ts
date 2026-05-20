import { User } from "./user.model";
import { WorkoutExercise } from "./workout-exercise.model";

export type Workout = {
    id: number;
    creator: User;
    name: string;
    creationTimestamp: number;
    exercises: WorkoutExercise[]
}