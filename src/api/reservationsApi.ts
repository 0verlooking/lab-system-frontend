import http from './http';
import type { Reservation } from '../types/Reservation';

export interface ReservationCreateRequest {
    labId: number;
    startTime: string; // ISO date-time string
    endTime: string; // ISO date-time string
}

export interface ReservationUpdateStatusRequest {
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

export const reservationsApi = {
    getAll: async (): Promise<Reservation[]> => {
        const res = await http.get<Reservation[]>('/reservations');
        return res.data;
    },

    getMy: async (): Promise<Reservation[]> => {
        const res = await http.get<Reservation[]>('/reservations/my');
        return res.data;
    },

    create: async (payload: ReservationCreateRequest): Promise<Reservation> => {
        const res = await http.post<Reservation>('/reservations', payload);
        return res.data;
    },

    updateStatus: async (id: number, status: string): Promise<Reservation> => {
        const res = await http.put<Reservation>(`/reservations/${id}/status`, { status });
        return res.data;
    },

    delete: async (id: number): Promise<void> => {
        await http.delete(`/reservations/${id}`);
    },
};
