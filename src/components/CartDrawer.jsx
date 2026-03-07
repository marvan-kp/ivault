import React from 'react';
import { X, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity } = useShop();

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.discountPrice * item.quantity), 0);
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;

        let message = "Hello iVault Accessories, I would like to place an order:\n\n";

        cart.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n`;
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Price: ₹${(item.discountPrice * item.quantity).toLocaleString()}\n\n`;
        });

        message += `*Total Order Value: ₹${calculateTotal().toLocaleString()}*\n\n`;
        message += "Please let me know how to proceed with payment and delivery.";

        // WhatsApp number provided by user
        const phoneNumber = "+917907443251";
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    };

    if (!isOpen && cart.length === 0) return null;

    return (
        <div className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className={`cart-drawer glass ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h2><ShoppingBag size={20} /> Your Cart</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Close Cart">
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <ShoppingBag size={48} />
                            <p>Your cart is empty.</p>
                            <button className="btn-secondary" onClick={onClose}>Continue Shopping</button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.media?.[0] || item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h4>{item.name}</h4>
                                    <p className="cart-item-price">₹{item.discountPrice.toLocaleString()}</p>

                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                disabled={item.stock <= item.quantity}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total</span>
                            <span>₹{calculateTotal().toLocaleString()}</span>
                        </div>
                        <p className="checkout-note">Checkout sends your order to our WhatsApp.</p>
                        <button className="btn-primary btn-checkout" onClick={handleCheckout}>
                            <MessageCircle size={18} /> Order via WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
