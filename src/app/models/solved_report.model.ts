import { Moderator } from "./moderator.model";
import { Report } from "./report.model";

export type SolvedReport = {
    id: number;
    moderator: Moderator;
    report: Report;
    timestamp: number;
    outcome: string;
}