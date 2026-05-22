import { User } from "./user.model";

export type Report = {
    id: number;
    reporter: User;
    reportee: User;
    timestamp: number;
    reason: string;
}