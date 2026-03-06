import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Lock } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginAdmin } = useShop();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loginAdmin(username, password)) {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid username or password (use ivault@nazim / IIvv@#2026)');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card glass">
                <div className="login-icon-wrapper">
                    <Lock size={32} />
                </div>
                <h2>Admin Access</h2>
                <p>Login to manage iVault Accessories</p>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter admin username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-100">Login to Dashboard</button>
                </form>


            </div>
        </div>
    );
};

export default AdminLogin;
