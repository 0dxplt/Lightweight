export type SessionCard = {
    username: string;
    sessionName: string;
    sessionId: number;
    gainedXP: number;
    tags: string[];
    avatarUrl: string | null;
    verified: boolean;
    pt: boolean;
}