import { ExerciseMuscolarGroup } from "./exercise-muscolar-group.mode";

export type Exercise = {
    id: number;
    name: string;
    desc: string;
    imgpath?: string;
    difficulty: number;
    groups: ExerciseMuscolarGroup[]
}