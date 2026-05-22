import { Nation } from "./nation.model"

export type City = {
    id: number,
    name: string,
    nation: Nation;
}