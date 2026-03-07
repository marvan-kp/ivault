import React, { createContext, useState, useEffect, useContext } from 'react';
import { ref, onValue, set, remove, update } from 'firebase/database';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { database, auth } from '../config/firebase';

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
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Listen for Realtime Database changes
    useEffect(() => {
        const productsRef = ref(database, 'products');
        const unsubscribeProducts = onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Firebase stores it as an object dictionary if added with specific IDs
                const productList = Object.values(data).sort((a, b) => b.createdAt - a.createdAt);
                setProducts(productList);
            } else {
                setProducts([]);
            }
        }, (error) => {
            console.error("Error fetching products from Firebase:", error);
        });

        // Listen for Categories
        const categoriesRef = ref(database, 'categories');
        const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const categoryList = Object.values(data).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
                setCategories(categoryList);
            } else {
                setCategories([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching categories from Firebase:", error);
            setLoading(false);
        });

        // Cleanup listener on unmount
        return () => {
            unsubscribeProducts();
            unsubscribeCategories();
        };
    }, []);

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('ivault_wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('ivault_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [isAdmin, setIsAdmin] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // Listen to Firebase Auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAdmin(!!user);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        localStorage.setItem('ivault_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    useEffect(() => {
        localStorage.setItem('ivault_cart', JSON.stringify(cart));
    }, [cart]);

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

    // Cart Methods
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, amount) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQuantity = Math.max(1, item.quantity + amount);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
    };

    // General Products Methods
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

    // Category Methods
    const addCategory = async (categoryName) => {
        try {
            const id = Date.now().toString();
            const newCategory = { id, name: categoryName, createdAt: Date.now() };
            const categoryRef = ref(database, `categories/${id}`);
            await set(categoryRef, newCategory);
        } catch (error) {
            console.error("Error adding category", error);
        }
    };

    const deleteCategory = async (id) => {
        try {
            const categoryRef = ref(database, `categories/${id}`);
            await remove(categoryRef);
        } catch (error) {
            console.error("Error deleting category", error);
        }
    };

    const loginAdmin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            let message = "Invalid email or password.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                message = "Invalid email or password.";
            } else if (error.code === 'auth/invalid-email') {
                message = "Invalid email format.";
            } else if (error.code === 'auth/too-many-requests') {
                message = "Too many attempts. Try again later.";
            }
            return { success: false, message };
        }
    };

    const logoutAdmin = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <ShopContext.Provider value={{
            products,
            categories,
            loading,
            authLoading,
            wishlist,
            cart,
            isAdmin,
            toggleWishlist,
            isWishlisted,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            addProduct,
            updateProduct,
            deleteProduct,
            addCategory,
            deleteCategory,
            loginAdmin,
            logoutAdmin
        }}>
            {children}
        </ShopContext.Provider>
    );
};
