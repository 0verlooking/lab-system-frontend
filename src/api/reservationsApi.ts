import axiosClient from './axiosClient';
import type {Reservation} from '../types/Reservation';

export const reservationsApi = {
    getAll: async (): Promise<Reservation[]> => {
        const res = await axiosClient.get<Reservation[]>('/reservations');
        return res.data;
    },

    create: async (payload: Omit<Reservation, 'id'>): Promise<Reservation> => {
        const res = await axiosClient.post<Reservation>('/reservations', payload);
        return res.data;
    },
};
