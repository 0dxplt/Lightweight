import { Moderator } from "./moderator.model";
import { ValidationRequest } from "./request.model";

export type SolvedRequest = {
    id: number;
    request: ValidationRequest;
    moderator: Moderator;
    status: "APPROVED" | "REJECTED";
    timestamp: number;
}