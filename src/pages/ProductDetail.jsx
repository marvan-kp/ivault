import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, MessageCircle, Heart, ShieldCheck, Truck, RefreshCcw, ShoppingBag } from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const { products, toggleWishlist, isWishlisted, addToCart } = useShop();

    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="product-not-found container">
                <h2>Product Not Found</h2>
                <p>The product you are looking for does not exist or has been removed.</p>
                <Link to="/products" className="btn-primary">Back to Products</Link>
            </div>
        );
    }

    const {
        name,
        category,
        brand,
        image,
        mrp,
        discountPrice,
        stock,
        description,
        isTrending,
        isFlashDeal
    } = product;

    const inWishlist = isWishlisted(product.id);
    const discountPercentage = Math.round(((mrp - discountPrice) / mrp) * 100);

    const generateWhatsAppLink = () => {
        const message = `Hello iVault Accessories, I want to buy this product.\n\nProduct Name: ${name}\nPrice: ₹${discountPrice}\n\nIs this product available?`;
        return `https://wa.me/917907443251?text=${encodeURIComponent(message)}`;
    };

    const getStockStatus = () => {
        if (stock === 0) return { text: 'Out of Stock', class: 'stock-out' };
        if (stock < 5) return { text: `Only ${stock} Left - Selling Fast!`, class: 'stock-limited' };
        return { text: 'In Stock', class: 'stock-in' };
    };

    const stockStatus = getStockStatus();

    // Multi-media setup
    const mediaList = product.media && product.media.length > 0 ? product.media : [image || "https://placehold.co/800x800/1c1c1c/c9a227?text=Product+Image"];
    const activeMedia = mediaList[activeMediaIndex];
    const isVideo = activeMedia && activeMedia.startsWith('data:video');

    const nextImage = () => {
        setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
    };

    const prevImage = () => {
        setActiveMediaIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
    };

    return (
        <div className="product-detail-page container">
            <button className="btn-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            <div className="product-detail-layout">
                <div className="product-gallery">
                    <div className="main-image-container" style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-primary)' }}>
                        {isVideo ? (
                            <video src={activeMedia} className="main-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted controls loop playsInline />
                        ) : (
                            <img src={activeMedia} alt={name} className="main-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}

                        {mediaList.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    style={{
                                        position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)',
                                        background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', width: '40px', height: '40px',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
                                    }}>
                                    &#10094;
                                </button>
                                <button
                                    onClick={nextImage}
                                    style={{
                                        position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)',
                                        background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', width: '40px', height: '40px',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
                                    }}>
                                    &#10095;
                                </button>
                            </>
                        )}

                        <div className="product-badges-large">
                            {discountPercentage > 0 && <span className="badge badge-accent">-{discountPercentage}%</span>}
                            {isTrending && <span className="badge badge-trending">🔥 Trending</span>}
                            {isFlashDeal && <span className="badge badge-deal">⚡ Flash Deal</span>}
                        </div>

                        <button
                            className={`wishlist-btn-large ${inWishlist ? 'active' : ''}`}
                            onClick={() => toggleWishlist(product)}
                        >
                            <Heart size={24} fill={inWishlist ? 'var(--color-accent)' : 'none'} />
                        </button>
                    </div>

                    {mediaList.length > 1 && (
                        <div className="media-thumbnails" style={{ display: 'flex', gap: '16px', marginTop: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                            {mediaList.map((m, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveMediaIndex(i)}
                                    style={{
                                        width: '80px', height: '80px', flexShrink: 0,
                                        borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                                        border: i === activeMediaIndex ? '2px solid var(--color-accent)' : '2px solid transparent',
                                        cursor: 'pointer', transition: 'var(--transition-fast)', backgroundColor: 'var(--color-primary)'
                                    }}
                                >
                                    {m.startsWith('data:video') ? (
                                        <video src={m} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                    ) : (
                                        <img src={m} alt={`Thumbnail ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-info-panel">
                    <div className="breadcrumbs">
                        <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span>{category}</span>
                    </div>

                    <h1 className="detail-title">{name}</h1>
                    <p className="detail-brand">Brand: <span>{brand}</span></p>

                    <div className="detail-pricing">
                        <span className="detail-discount-price">₹{discountPrice?.toLocaleString()}</span>
                        {mrp > discountPrice && <span className="detail-mrp">₹{mrp?.toLocaleString()}</span>}
                        {discountPercentage > 0 && <span className="detail-savings">You save ₹{(mrp - discountPrice).toLocaleString()}</span>}
                    </div>

                    <div className={`detail-stock ${stockStatus.class}`}>
                        <span className="stock-dot"></span>
                        {stockStatus.text}
                    </div>

                    <div className="detail-description">
                        <h3>Product Description</h3>
                        <p>{description || 'Premium quality accessory designed for perfection. Enhance your daily tech experience with this stunningly crafted product.'}</p>
                    </div>

                    <div className="detail-actions">
                        <button
                            className={`btn-primary btn-buy-large ${stock === 0 ? 'disabled' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                if (stock > 0) addToCart(product);
                            }}
                            disabled={stock === 0}
                            style={{ flex: 1 }}
                        >
                            <ShoppingBag size={24} />
                            <span>{stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                        </button>

                        <a
                            href={stock > 0 ? generateWhatsAppLink() : '#'}
                            target={stock > 0 ? "_blank" : "_self"}
                            rel="noreferrer"
                            className={`btn-secondary btn-whatsapp ${stock === 0 ? 'disabled' : ''}`}
                            onClick={(e) => stock === 0 && e.preventDefault()}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', background: '#25D366', color: 'white', borderColor: '#25D366' }}
                        >
                            <MessageCircle size={24} />
                            <span>Buy on WhatsApp</span>
                        </a>
                    </div>

                    <div className="detail-features">
                        <div className="feature-item">
                            <ShieldCheck size={24} />
                            <div>
                                <h4>Premium Quality</h4>
                                <p>100% Genuine product</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <Truck size={24} />
                            <div>
                                <h4>Fast Delivery</h4>
                                <p>Secure shipping</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <RefreshCcw size={24} />
                            <div>
                                <h4>Easy Returns</h4>
                                <p>2-day replacement policy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
