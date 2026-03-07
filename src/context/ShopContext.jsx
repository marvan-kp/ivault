import React, { createContext, useState, useEffect, useContext } from 'react';
import { ref, onValue, set, remove, update } from 'firebase/database';
import { database } from '../config/firebase';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

const initialProducts = [
    {
        id: 1,
        name: 'Apple iPhone 15 Pro Max',
        category: 'Used Mobiles',
        brand: 'Apple',
        image: 'https://placehold.co/400x400/1c1c1c/c9a227?text=iPhone+15+Pro',
        mrp: 159900,
        discountPrice: 139900,
        stock: 2,
        isTrending: true,
        isFlashDeal: false,
        description: 'Premium used mobile in excellent condition.'
    },
    {
        id: 2,
        name: 'Luxury Leather Back Cover for iPhone 14',
        category: 'Back Covers',
        brand: 'Apple',
        image: 'https://placehold.co/400x400/1c1c1c/c9a227?text=Leather+Cover',
        mrp: 2999,
        discountPrice: 1499,
        stock: 15,
        isTrending: true,
        isFlashDeal: true,
        description: 'High-quality leather back cover with MagSafe support.'
    },
    {
        id: 3,
        name: 'AirPods Pro (2nd Generation)',
        category: 'AirPods',
        brand: 'Apple',
        image: 'https://placehold.co/400x400/1c1c1c/c9a227?text=AirPods+Pro',
        mrp: 24900,
        discountPrice: 22900,
        stock: 0,
        isTrending: true,
        isFlashDeal: false,
        description: 'Rich, high-quality audio and voice.'
    },
    {
        id: 4,
        name: 'Samsung Galaxy Watch 6 Classic',
        category: 'Smart Watches',
        brand: 'Samsung',
        image: 'https://placehold.co/400x400/1c1c1c/c9a227?text=Galaxy+Watch',
        mrp: 36999,
        discountPrice: 32999,
        stock: 4,
        isTrending: false,
        isFlashDeal: true,
        description: 'Premium smartwatch with rotating bezel.'
    }
];

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Listen for Realtime Database changes
    useEffect(() => {
        const productsRef = ref(database, 'products');
        const unsubscribe = onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Firebase stores it as an object dictionary if added with specific IDs
                const productList = Object.values(data).sort((a, b) => b.createdAt - a.createdAt);
                setProducts(productList);
            } else {
                setProducts([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products from Firebase:", error);
            setLoading(false);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('ivault_wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    const [isAdmin, setIsAdmin] = useState(() => {
        return localStorage.getItem('ivault_admin') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('ivault_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                return prev.filter(item => item.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const isWishlisted = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const addProduct = async (product) => {
        try {
            const id = Date.now();
            const newProduct = { ...product, id, createdAt: id };
            const productRef = ref(database, `products/${id}`);
            await set(productRef, newProduct);
        } catch (error) {
            console.error("Error adding product", error);
        }
    };

    const updateProduct = async (updated) => {
        try {
            const productRef = ref(database, `products/${updated.id}`);
            await update(productRef, updated);
        } catch (error) {
            console.error("Error updating product", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const productRef = ref(database, `products/${id}`);
            await remove(productRef);
        } catch (error) {
            console.error("Error deleting product", error);
        }
    };

    const loginAdmin = (username, password) => {
        if (username === 'ivault@nazim' && password === 'IIvv@#2026') {
            setIsAdmin(true);
            localStorage.setItem('ivault_admin', 'true');
            return true;
        }
        return false;
    };

    const logoutAdmin = () => {
        setIsAdmin(false);
        localStorage.removeItem('ivault_admin');
    };

    return (
        <ShopContext.Provider value={{
            products,
            loading,
            wishlist,
            isAdmin,
            toggleWishlist,
            isWishlisted,
            addProduct,
            updateProduct,
            deleteProduct,
            loginAdmin,
            logoutAdmin
        }}>
            {children}
        </ShopContext.Provider>
    );
};
