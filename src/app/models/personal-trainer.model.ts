import { City } from "./city.model";
import { Gym } from "./gym.model";

export type PersonalTrainer = {
    proEmail: string;
    city: City;
    gym: Gym;
}