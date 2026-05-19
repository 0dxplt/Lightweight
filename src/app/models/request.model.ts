import { User } from "./user.model";

export type ValidationRequest = {
    id: number;
    user: User;
    timestamp: number;
}