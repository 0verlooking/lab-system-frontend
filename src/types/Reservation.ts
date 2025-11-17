export interface Reservation {
    id: number;
    labId: number;
    userId: number;
    startTime: string; // ISO date-time
    endTime: string;   // ISO date-time
    status: string;
}
