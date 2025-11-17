import React, { useEffect, useState } from 'react';
import { reservationsApi } from '../api/reservationsApi';
import type {Reservation} from '../types/Reservation';

export const ReservationsPage: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await reservationsApi.getAll();
                setReservations(data);
            } catch {
                setError('Не вдалося завантажити бронювання');
            }
        };
        load();
    }, []);

    return (
        <div style={{ padding: 16 }}>
            <h2>Reservations</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table border={1} cellPadding={4} cellSpacing={0}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Lab ID</th>
                    <th>User ID</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {reservations.map((r) => (
                    <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.labId}</td>
                        <td>{r.userId}</td>
                        <td>{r.startTime}</td>
                        <td>{r.endTime}</td>
                        <td>{r.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
