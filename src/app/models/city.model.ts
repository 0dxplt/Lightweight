import { Nation } from "./nation.model"

export type City = {
    id: number,
    name: string,
    nation: Nation;
}

export type CityMinimal = {
    id: number;
    nome: string;
}