import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import './Home.css';

const CATEGORIES = [
    { name: 'Used Mobiles', icon: '📱' },
    { name: 'Back Covers', icon: '🛡️' },
    { name: 'Screen Guards', icon: '✨' },
    { name: 'Smart Watches', icon: '⌚' },
    { name: 'AirPods', icon: '🎧' },
    { name: 'Fast Chargers', icon: '⚡' },
];

const Home = () => {
    const { products, toggleWishlist, isWishlisted } = useShop();
    const [timeLeft, setTimeLeft] = useState(3600 * 5); // 5 hours countdown for demo

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const trendingProducts = products.filter(p => p.isTrending);
    const flashDeals = products.filter(p => p.isFlashDeal);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg-gradient"></div>
                <div className="container hero-container">
                    <h1 className="hero-title">iVault Accessories</h1>
                    <p className="hero-subtitle">Premium Accessories & Tech Essentials</p>
                    <div className="hero-actions">
                        <Link to="/products" className="btn-primary">Browse Products</Link>
                        <Link to="/trending" className="btn-secondary">View Trending</Link>
                    </div>
                    {/* Floating animations handled in CSS */}
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="container">
                    <h2 className="section-title">Shop by Category</h2>
                    <div className="categories-grid">
                        {CATEGORIES.map(cat => (
                            <Link to={`/categories?filter=${cat.name}`} key={cat.name} className="category-card">
                                <span className="category-icon">{cat.icon}</span>
                                <span className="category-name">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Flash Deals Section */}
            {flashDeals.length > 0 && (
                <section className="flash-deals-section">
                    <div className="container">
                        <div className="deals-header">
                            <h2 className="section-title">
                                <span className="deal-icon">⚡</span> Flash Deals
                            </h2>
                            <div className="countdown-timer">
                                <span className="timer-label">Ends in</span>
                                <span className="timer-value">{formatTime(timeLeft)}</span>
                            </div>
                        </div>
                        <div className="product-grid">
                            {flashDeals.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    toggleWishlist={toggleWishlist}
                                    isWishlisted={isWishlisted(product.id)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Trending Products Section */}
            <section className="trending-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Trending Now</h2>
                        <Link to="/trending" className="view-all-link">View All</Link>
                    </div>

                    {/* Horizontal scroll wrapper */}
                    <div className="trending-carousel">
                        {trendingProducts.map(product => (
                            <div className="carousel-item" key={product.id}>
                                <ProductCard
                                    product={product}
                                    toggleWishlist={toggleWishlist}
                                    isWishlisted={isWishlisted(product.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Instagram Feed Section */}
            <section className="instagram-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Follow Us @ivault._</h2>
                        <a href="https://instagram.com/ivault._" target="_blank" rel="noreferrer" className="btn-secondary">
                            Follow on Instagram
                        </a>
                    </div>
                    <div className="instagram-widget-container" style={{ marginTop: '30px' }}>
                        <div className="elfsight-app-8f445d31-ca81-47a4-81d4-5295906ef1a1" data-elfsight-app-lazy></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
