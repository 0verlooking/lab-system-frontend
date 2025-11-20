import http from './http';
import type { Equipment } from '../types/Equipment';

export interface EquipmentCreateRequest {
    name: string;
    inventoryNumber: string;
    status: string;
    labId?: number;
}

export const equipmentApi = {
    getAll: async (): Promise<Equipment[]> => {
        const res = await http.get<Equipment[]>('/equipment');
        return res.data;
    },

    getByLabId: async (labId: number): Promise<Equipment[]> => {
        const res = await http.get<Equipment[]>(`/equipment/lab/${labId}`);
        return res.data;
    },

    create: async (equipment: EquipmentCreateRequest): Promise<Equipment> => {
        const res = await http.post<Equipment>('/equipment', equipment);
        return res.data;
    },

    update: async (id: number, equipment: EquipmentCreateRequest): Promise<Equipment> => {
        const res = await http.put<Equipment>(`/equipment/${id}`, equipment);
        return res.data;
    },

    delete: async (id: number): Promise<void> => {
        await http.delete(`/equipment/${id}`);
    },
};
