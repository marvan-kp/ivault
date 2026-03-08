import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', marginBottom: '8px' }}>
                        <img src="/logo.png" alt="iVault Accessories" style={{ height: '200px', objectFit: 'contain', margin: '-50px 0', transform: 'scale(1.2)' }} />
                        <span className="logo-text" style={{ color: '#C9A227', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '1px' }}>iVault <span style={{ color: '#fff', fontWeight: '400', fontSize: '1.2rem' }}>Accessories</span></span>
                    </Link>
                    <p className="footer-tagline">Premium Accessories & Tech Essentials</p>
                    <div className="footer-socials">
                        <a href="https://instagram.com/ivault._" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <Instagram size={24} />
                        </a>
                        <a href="https://wa.me/917907443251" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                            <Phone size={24} />
                        </a>
                    </div>
                </div>

                <div className="footer-links-group">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">All Products</Link></li>
                        <li><Link to="/trending">Trending</Link></li>
                        <li><Link to="/deals">Flash Deals</Link></li>
                    </ul>
                </div>

                <div className="footer-links-group">
                    <h4>Categories</h4>
                    <ul>
                        <li><Link to="/categories?filter=Used Mobiles">Used Mobiles</Link></li>
                        <li><Link to="/categories?filter=Back Covers">Back Covers</Link></li>
                        <li><Link to="/categories?filter=Smart Watches">Smart Watches</Link></li>
                        <li><Link to="/categories?filter=AirPods">AirPods</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                        Developed by <a href="https://www.instagram.com/_marvan_kp_?igsh=cmludzkwMm01NWI4" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: '500' }}>MARVAN</a>
                    </p>
                    <p>&copy; 2026 iVault Accessories. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
