export interface Equipment {
    id: number;
    name: string;
    inventoryNumber: string;
    status: string; // або enum, якщо хочеш
    labId?: number;
}
