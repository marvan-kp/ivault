import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Instagram, Phone } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar glass">
            <div className="container nav-container">
                <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                    <img src="/logo.png" alt="iVault Accessories" style={{ height: '150px', objectFit: 'contain', margin: '-35px 0', transform: 'scale(1.2)' }} />
                    <span className="logo-text" style={{ color: '#C9A227', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '1px' }}>iVault <span style={{ color: '#fff', fontWeight: '400', fontSize: '1rem' }}>Accessories</span></span>
                </Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/products">Categories</Link>
                    <Link to="/products">Trending</Link>
                </div>
                <div className="nav-actions">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Search..." />
                    </div>
                    <Link to="/wishlist" className="action-icon" aria-label="Wishlist">
                        <Heart size={20} />
                    </Link>
                    <a href="https://instagram.com/ivault._" target="_blank" rel="noreferrer" className="action-icon" aria-label="Instagram">
                        <Instagram size={20} />
                    </a>
                    <a href="https://wa.me/917907443251" target="_blank" rel="noreferrer" className="action-icon" aria-label="WhatsApp">
                        <Phone size={20} />
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
