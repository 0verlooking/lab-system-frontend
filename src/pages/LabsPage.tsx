import React, { useEffect, useState } from "react";
import { fetchLabs, createLab, deleteLab } from "../api/labsApi";

export const LabsPage = () => {
    const [labs, setLabs] = useState([]);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [description, setDescription] = useState("");

    const load = async () => {
        try {
            const data = await fetchLabs();
            setLabs(data);
        } catch (e) {
            console.error("403 — Немає доступу або неправильний токен");
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleCreate = async () => {
        await createLab({ name, location, capacity, description });
        await load();
    };

    const handleDelete = async (id) => {
        await deleteLab(id);
        await load();
    };

    return (
        <div>
            <h1>Labs</h1>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Capacity</th>
                    <th>Description</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {labs.map(l => (
                    <tr key={l.id}>
                        <td>{l.id}</td>
                        <td>{l.name}</td>
                        <td>{l.location}</td>
                        <td>{l.capacity}</td>
                        <td>{l.description}</td>
                        <td><button onClick={() => handleDelete(l.id)}>Delete</button></td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>Створити лабораторію</h3>

            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
            <input placeholder="Capacity" value={capacity} onChange={e => setCapacity(e.target.value)} />
            <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

            <button onClick={handleCreate}>Додати</button>
        </div>
    );
};
