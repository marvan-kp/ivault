import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import './Products.css';

const Products = () => {
    const { products, toggleWishlist, isWishlisted } = useShop();
    const [searchParams, setSearchParams] = useSearchParams();

    // States for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('filter') || 'All');
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Extract unique categories and brands
    const categories = ['All', ...new Set(products.map(p => p.category))];
    const brands = ['All', ...new Set(products.map(p => p.brand))];

    // Apply filters
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
        return matchesSearch && matchesCategory && matchesBrand;
    });

    // Apply sorting
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.discountPrice - b.discountPrice;
            case 'price-high':
                return b.discountPrice - a.discountPrice;
            default: // 'newest'
                return b.id - a.id;
        }
    });

    // Update selected category when URL query param changes
    useEffect(() => {
        const filter = searchParams.get('filter');
        if (filter) {
            setSelectedCategory(filter);
        }
    }, [searchParams]);

    const FilterSidebar = () => (
        <div className="filter-sidebar">
            <div className="filter-header-mobile">
                <h3>Filters</h3>
                <button className="close-filter" onClick={() => setIsMobileFilterOpen(false)}>
                    <X size={24} />
                </button>
            </div>

            <div className="filter-group">
                <h4>Category</h4>
                <div className="filter-options">
                    {categories.map(cat => (
                        <label key={cat} className="custom-radio">
                            <input
                                type="radio"
                                name="category"
                                value={cat}
                                checked={selectedCategory === cat}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setSearchParams(e.target.value === 'All' ? {} : { filter: e.target.value });
                                }}
                            />
                            <span className="radio-label">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <h4>Brand</h4>
                <div className="filter-options">
                    {brands.map(brand => (
                        <label key={brand} className="custom-radio">
                            <input
                                type="radio"
                                name="brand"
                                value={brand}
                                checked={selectedBrand === brand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                            />
                            <span className="radio-label">{brand}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="products-page container">
            <div className="page-header">
                <h1 className="page-title">Shop Collection</h1>

                <div className="products-toolbar">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="toolbar-controls">
                        <button className="btn-filter-mobile" onClick={() => setIsMobileFilterOpen(true)}>
                            <SlidersHorizontal size={20} />
                            <span>Filters</span>
                        </button>

                        <select
                            className="sort-dropdown"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest Arrivals</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="products-layout">
                <div className={`sidebar-wrapper ${isMobileFilterOpen ? 'open' : ''}`}>
                    <div className="sidebar-backdrop" onClick={() => setIsMobileFilterOpen(false)}></div>
                    <FilterSidebar />
                </div>

                <div className="products-grid-container">
                    {filteredProducts.length === 0 ? (
                        <div className="empty-state">
                            <h2>No products found</h2>
                            <p>Try adjusting your search or filters.</p>
                            <button
                                className="btn-primary"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('All');
                                    setSelectedBrand('All');
                                    setSearchParams({});
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="results-count">Showing {filteredProducts.length} results</p>
                            <div className="product-grid">
                                {filteredProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        toggleWishlist={toggleWishlist}
                                        isWishlisted={isWishlisted(product.id)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
