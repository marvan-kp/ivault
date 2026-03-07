import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Package, TrendingUp, Zap, AlertTriangle, Plus, Edit2, Trash2, LogOut, Loader, UploadCloud } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { products, categories, isAdmin, authLoading, logoutAdmin, deleteProduct, updateProduct, addProduct, addCategory, deleteCategory } = useShop();
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isManagingCategories, setIsManagingCategories] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [currentProduct, setCurrentProduct] = useState(null);

    if (authLoading) {
        return <div className="admin-dashboard container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><h2>Loading Admin Details...</h2></div>;
    }

    if (!isAdmin) {
        return <Navigate to="/admin" />;
    }

    // Dashboard Stats
    const totalProducts = products.length;
    const trendingCount = products.filter(p => p.isTrending).length;
    const dealsCount = products.filter(p => p.isFlashDeal).length;
    const lowStockCount = products.filter(p => p.stock < 5).length;

    const handleToggleStatus = (id, field, value) => {
        const product = products.find(p => p.id === id);
        if (product) {
            updateProduct({ ...product, [field]: !value });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const openAddModal = () => {
        setCurrentProduct({
            name: '',
            brand: '',
            category: 'Accessories',
            image: '',
            mrp: 0,
            discountPrice: 0,
            stock: 0,
            description: '',
            isTrending: false,
            isFlashDeal: false
        });
        setIsEditing(true);
    };

    const openEditModal = (product) => {
        setCurrentProduct({ ...product });
        setIsEditing(true);
    };

    const handleSaveProduct = (e) => {
        e.preventDefault();

        if (currentProduct.id) {
            updateProduct(currentProduct);
        } else {
            addProduct(currentProduct);
        }

        setIsEditing(false);
        setCurrentProduct(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', '315f617f80eb4a8592a1b143aa1409ee'); // User's API key

        try {
            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                setCurrentProduct(prev => ({ ...prev, image: data.data.url }));
            } else {
                alert('Image upload failed: ' + (data.error?.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please check your connection.');
        } finally {
            setIsUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            addCategory(newCategoryName.trim());
            setNewCategoryName('');
        }
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategory(id);
        }
    };

    return (
        <div className="admin-dashboard container">
            <div className="admin-header">
                <div>
                    <h1 className="page-title">Dashboard Overview</h1>
                    <p className="admin-subtitle">Manage your products and store settings.</p>
                </div>
                <button className="btn-secondary btn-logout" onClick={logoutAdmin}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: '#3498db' }}><Package size={24} /></div>
                    <div className="stat-info">
                        <h3>Total Products</h3>
                        <p>{totalProducts}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: '#e74c3c' }}><TrendingUp size={24} /></div>
                    <div className="stat-info">
                        <h3>Trending</h3>
                        <p>{trendingCount}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: '#9b59b6' }}><Zap size={24} /></div>
                    <div className="stat-info">
                        <h3>Flash Deals</h3>
                        <p>{dealsCount}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: '#f1c40f' }}><AlertTriangle size={24} /></div>
                    <div className="stat-info">
                        <h3>Low Stock Alerts</h3>
                        <p>{lowStockCount}</p>
                    </div>
                </div>
            </div>

            <div className="products-manager">
                <div className="manager-header">
                    <h2>Product Inventory</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-secondary btn-add" onClick={() => setIsManagingCategories(true)}>
                            Manage Categories
                        </button>
                        <button className="btn-primary btn-add" onClick={openAddModal}>
                            <Plus size={18} /> Add Product
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price / MRP</th>
                                <th>Stock</th>
                                <th>Status Toggles</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="table-product-cell">
                                            {product.media && product.media[0] ? (
                                                product.media[0].startsWith('data:video') ? (
                                                    <video src={product.media[0]} className="table-img" style={{ objectFit: 'cover' }} muted />
                                                ) : (
                                                    <img src={product.media[0]} alt={product.name} className="table-img" />
                                                )
                                            ) : (
                                                <img src={product.image || 'https://placehold.co/100x100/1c1c1c/c9a227'} alt={product.name} className="table-img" />
                                            )}
                                            <div>
                                                <strong>{product.name}</strong>
                                                <span className="table-category">{product.category}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="table-price">₹{product.discountPrice?.toLocaleString()}</div>
                                        <div className="table-mrp">₹{product.mrp?.toLocaleString()}</div>
                                    </td>
                                    <td>
                                        <span className={`stock-badge ${product.stock === 0 ? 'out' : product.stock < 5 ? 'low' : 'in'}`}>
                                            {product.stock} in stock
                                        </span>
                                    </td>
                                    <td>
                                        <div className="status-toggles">
                                            <label className="toggle-label">
                                                <input
                                                    type="checkbox"
                                                    checked={product.isTrending}
                                                    onChange={() => handleToggleStatus(product.id, 'isTrending', product.isTrending)}
                                                />
                                                Trending
                                            </label>
                                            <label className="toggle-label">
                                                <input
                                                    type="checkbox"
                                                    checked={product.isFlashDeal}
                                                    onChange={() => handleToggleStatus(product.id, 'isFlashDeal', product.isFlashDeal)}
                                                />
                                                Flash Deal
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-icon-small edit" onClick={() => openEditModal(product)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn-icon-small delete" onClick={() => handleDelete(product.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center">No products found. Add one to get started.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Edit/Add Modal */}
            {isEditing && (
                <div className="modal-overlay">
                    <div className="modal-content glass">
                        <h2>{currentProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSaveProduct} className="product-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input type="text" required value={currentProduct.name} onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })} />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Image URL</span>
                                        <label style={{ cursor: isUploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#c9a227', color: '#1a1a1a', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600, opacity: isUploading ? 0.7 : 1, transition: 'all 0.2s' }}>
                                            {isUploading ? <Loader size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                                            {isUploading ? 'Uploading...' : 'Upload Image'}
                                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={isUploading} />
                                        </label>
                                    </label>
                                    <input type="url" required value={currentProduct.image} onChange={e => setCurrentProduct({ ...currentProduct, image: e.target.value })} placeholder="https://example.com/image.jpg" disabled={isUploading} />
                                    {currentProduct.image && (
                                        <img src={currentProduct.image} alt="Preview" style={{ marginTop: '10px', height: '100px', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }} />
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={currentProduct.category} onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}>
                                        {categories.length === 0 && <option value="Accessories">Accessories</option>}
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Brand</label>
                                    <input type="text" required value={currentProduct.brand} onChange={e => setCurrentProduct({ ...currentProduct, brand: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-row three-cols">
                                <div className="form-group">
                                    <label>MRP (₹)</label>
                                    <input type="number" required value={currentProduct.mrp} onChange={e => setCurrentProduct({ ...currentProduct, mrp: Number(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label>Discount Price (₹)</label>
                                    <input type="number" required value={currentProduct.discountPrice} onChange={e => setCurrentProduct({ ...currentProduct, discountPrice: Number(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input type="number" required value={currentProduct.stock} onChange={e => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea rows="3" value={currentProduct.description} onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}></textarea>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)} disabled={isUploading}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={isUploading}>Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manage Categories Modal */}
            {isManagingCategories && (
                <div className="modal-overlay">
                    <div className="modal-content glass" style={{ maxWidth: '500px' }}>
                        <h2>Manage Categories</h2>

                        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <input
                                type="text"
                                required
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                placeholder="New category name..."
                                style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-light)' }}
                            />
                            <button type="submit" className="btn-primary">Add</button>
                        </form>

                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {categories.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No categories found.</p>
                            ) : (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {categories.map(cat => (
                                        <li key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span>{cat.name}</span>
                                            <button onClick={() => handleDeleteCategory(cat.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '5px' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="form-actions" style={{ marginTop: '20px' }}>
                            <button className="btn-secondary" onClick={() => setIsManagingCategories(false)} style={{ width: '100%' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
