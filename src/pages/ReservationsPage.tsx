import React, { useEffect, useState } from 'react';
import { reservationsApi } from '../api/reservationsApi';
import { labsApi } from '../api/labsApi';
import type { Reservation } from '../types/Reservation';
import type { Lab } from '../types/Lab';
import { useAuth } from '../context/AuthContext';

export const ReservationsPage: React.FC = () => {
    const { role } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [labId, setLabId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const loadData = async () => {
        try {
            setLoading(true);
            const [reservationsData, labsData] = await Promise.all([
                role === 'ADMIN' ? reservationsApi.getAll() : reservationsApi.getMy(),
                labsApi.getAll(),
            ]);
            setReservations(reservationsData);
            setLabs(labsData);
            setError('');
        } catch (err: any) {
            setError('Помилка завантаження даних');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [role]);

    const resetForm = () => {
        setLabId('');
        setStartTime('');
        setEndTime('');
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await reservationsApi.create({
                labId: parseInt(labId),
                startTime,
                endTime,
            });

            await loadData();
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Помилка створення резервації');
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await reservationsApi.updateStatus(id, status);
            await loadData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Помилка оновлення статусу');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Ви впевнені, що хочете скасувати цю резервацію?')) {
            return;
        }

        try {
            await reservationsApi.delete(id);
            await loadData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Помилка видалення резервації');
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'badge badge-approved';
            case 'PENDING':
                return 'badge badge-pending';
            case 'REJECTED':
            case 'CANCELLED':
                return 'badge badge-rejected';
            default:
                return 'badge';
        }
    };

    const getLabName = (labId: number) => {
        const lab = labs.find((l) => l.id === labId);
        return lab ? lab.name : `Lab #${labId}`;
    };

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('uk-UA');
    };

    const isAdmin = role === 'ADMIN';

    // Get minimum datetime for reservation (current time + 1 hour)
    const getMinDateTime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Резервації</h1>
                <p className="page-description">
                    {isAdmin ? 'Управління всіма резерваціями' : 'Ваші резервації лабораторій'}
                </p>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Скасувати' : 'Створити резервацію'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="card-header">Нова резервація</h2>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label className="form-label">Лабораторія</label>
                            <select
                                className="form-select"
                                value={labId}
                                onChange={(e) => setLabId(e.target.value)}
                                required
                            >
                                <option value="">Оберіть лабораторію</option>
                                {labs.map((lab) => (
                                    <option key={lab.id} value={lab.id}>
                                        {lab.name} - {lab.location} (Місткість: {lab.capacity})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Час початку</label>
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                min={getMinDateTime()}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Час завершення</label>
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                min={startTime || getMinDateTime()}
                                required
                            />
                        </div>

                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary">
                                Створити
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                Скасувати
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            ) : reservations.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📅</div>
                    <h2 className="empty-state-title">Немає резервацій</h2>
                    <p className="empty-state-description">
                        {isAdmin
                            ? 'Резервації поки що не створені'
                            : 'Створіть першу резервацію, щоб забронювати лабораторію'}
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Лабораторія</th>
                                {isAdmin && <th>Користувач ID</th>}
                                <th>Початок</th>
                                <th>Завершення</th>
                                <th>Статус</th>
                                <th>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.id}</td>
                                    <td>{getLabName(reservation.labId)}</td>
                                    {isAdmin && <td>{reservation.userId}</td>}
                                    <td>{formatDateTime(reservation.startTime)}</td>
                                    <td>{formatDateTime(reservation.endTime)}</td>
                                    <td>
                                        <span className={getStatusBadgeClass(reservation.status)}>
                                            {reservation.status === 'APPROVED'
                                                ? 'Підтверджено'
                                                : reservation.status === 'PENDING'
                                                ? 'Очікує'
                                                : reservation.status === 'REJECTED'
                                                ? 'Відхилено'
                                                : 'Скасовано'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            {isAdmin && reservation.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() =>
                                                            handleUpdateStatus(reservation.id, 'APPROVED')
                                                        }
                                                    >
                                                        Підтвердити
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            handleUpdateStatus(reservation.id, 'REJECTED')
                                                        }
                                                    >
                                                        Відхилити
                                                    </button>
                                                </>
                                            )}
                                            {!isAdmin && reservation.status === 'PENDING' && (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(reservation.id)}
                                                >
                                                    Скасувати
                                                </button>
                                            )}
                                            {isAdmin && (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(reservation.id)}
                                                >
                                                    Видалити
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
