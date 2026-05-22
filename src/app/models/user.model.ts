import { Nation } from "./nation.model";

export type User = {
    id: number;
    username: string;
    name?: string;
    surname?: string;
    email: string;
    birthdate?: Date;
    propic?: string;
    weight: number;
    height: number;
    nationality?: Nation;
    sLevel: number;
    gLevel: number;
    xp: number;
    followers: number;
    following: number;
    verified: boolean;
}