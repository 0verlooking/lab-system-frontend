import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
    const { token, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav
            style={{
                padding: '8px 16px',
                borderBottom: '1px solid #ccc',
                marginBottom: 16,
            }}
        >
            <Link to="/labs" style={{ marginRight: 16 }}>
                Labs
            </Link>
            <Link to="/equipment" style={{ marginRight: 16 }}>
                Equipment
            </Link>
            <Link to="/reservations" style={{ marginRight: 16 }}>
                Reservations
            </Link>

            <span style={{ float: 'right' }}>
        {token ? (
            <>
                <span style={{ marginRight: 8 }}>Role: {role}</span>
                <button onClick={handleLogout}>Logout</button>
            </>
        ) : (
            <Link to="/login">Login</Link>
        )}
      </span>
        </nav>
    );
};
