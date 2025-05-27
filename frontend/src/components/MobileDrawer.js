import React from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import "./MobileDrawer.css";
import { useState, useEffect } from "react";




const MobileDrawer = ({ isOpen, onClose, currentUser, cartItems }) => {

    const getTotalPrice = () => {
        if (!Array.isArray(cartItems)) return "0.00";

        const total = cartItems.reduce((sum, item) => {
            if (!item || !Array.isArray(item.prices) || item.prices.length === 0) {
                return sum;
            }

            const priceEntry = item.prices[0];
            let variantPrice = 0;

            if (typeof priceEntry === "number") {
                // direct numeric price (e.g. drinks)
                variantPrice = priceEntry;
            } else if (typeof priceEntry === "object" && priceEntry !== null) {
                // structured price (e.g. pizza with variants)
                if (item.variant && priceEntry[item.variant] !== undefined) {
                    variantPrice = priceEntry[item.variant];
                } else {
                    const firstAvailable = Object.values(priceEntry).find(p => typeof p === "number");
                    variantPrice = firstAvailable || 0;
                }
            }

            const qty = parseInt(item.quantity);
            if (!isNaN(qty) && typeof variantPrice === "number") {
                return sum + variantPrice * qty;
            }

            return sum;
        }, 0);

        return total.toFixed(2);
    };

    const getTotalItems = () => {
        if (!Array.isArray(cartItems)) return 0;

        return cartItems.reduce((sum, item) => {
            const qty = parseInt(item.quantity);
            return sum + (isNaN(qty) ? 0 : qty);
        }, 0);
    };

    const [showUpdated, setShowUpdated] = useState(false);

    useEffect(() => {
        if (cartItems.length > 0) {
            setShowUpdated(true);
            const timer = setTimeout(() => setShowUpdated(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [cartItems]);

    return (
        <div className={`drawer-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
            <div className="drawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                    <Link to="/" onClick={onClose} className="drawer-brand text-danger text-decoration-none">
                        <h2 className="drawer-brand">MIZZA PIZZA</h2>
                    </Link>
                    <button onClick={onClose} className="close-btn">
                        <FaTimes />
                    </button>
                </div>
                <div className="drawer-user-info">
                    {currentUser ? (
                        <p className="drawer-username">
                            {currentUser?.isAdmin && (
                                <span className="badge-admin">Admin</span>
                            )}
                            {currentUser?.isPremium && (
                                <span className="badge-premium">Premium</span>
                            )}
                            {currentUser.name}
                        </p>

                    ) : (
                        <p className="drawer-username">Vizitator</p>
                    )}
                    <Link to="/cart" onClick={onClose} className="drawer-cart-link">
                        🛒 {getTotalItems()} produse • {getTotalPrice()} RON
                    </Link>

                </div>

                {showUpdated && (
                    <div className="cart-toast">
                        ✅ Coș actualizat
                    </div>
                )}


                <nav className="drawer-links">
                    <Link to="/pizzamenu" onClick={onClose}>Pizza</Link>
                    <Link to="/drinks" onClick={onClose}>Băuturi</Link>
                    <Link to="/book" onClick={onClose}>Rezervare</Link>
                    {currentUser ? (
                        <>
                            <Link to="/orders" onClick={onClose}>Comenzile mele</Link>
                            {currentUser.isAdmin && (
                                <Link to="/admin" onClick={onClose}>Panou Admin</Link>
                            )}
                            <Link to="/makeuserpremium" onClick={onClose}>
                                {currentUser?.isPremium ? "Dezabonare Premium?" : "Premium?"}
                            </Link>
                            <Link to="/login" onClick={onClose}>Deconectare</Link>
                        </>
                    ) : (
                        <Link to="/login" onClick={onClose}>Autentificare</Link>
                    )}
                </nav>
            </div>
        </div>
    );
};

export default MobileDrawer;
