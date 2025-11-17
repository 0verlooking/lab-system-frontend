import axiosClient from './axiosClient';
import type {Equipment} from '../types/Equipment';

export const equipmentApi = {
    getAll: async (): Promise<Equipment[]> => {
        const res = await axiosClient.get<Equipment[]>('/equipment');
        return res.data;
    },
};
