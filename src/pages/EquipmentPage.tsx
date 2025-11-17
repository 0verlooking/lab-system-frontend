import React, { useEffect, useState } from 'react';
import { equipmentApi } from '../api/equipmentApi';
import type {Equipment} from '../types/Equipment';

export const EquipmentPage: React.FC = () => {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await equipmentApi.getAll();
                setEquipment(data);
            } catch {
                setError('Не вдалося завантажити обладнання');
            }
        };
        load();
    }, []);

    return (
        <div style={{ padding: 16 }}>
            <h2>Equipment</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table border={1} cellPadding={4} cellSpacing={0}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Inventory #</th>
                    <th>Status</th>
                    <th>Lab ID</th>
                </tr>
                </thead>
                <tbody>
                {equipment.map((e) => (
                    <tr key={e.id}>
                        <td>{e.id}</td>
                        <td>{e.name}</td>
                        <td>{e.inventoryNumber}</td>
                        <td>{e.status}</td>
                        <td>{e.labId}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
