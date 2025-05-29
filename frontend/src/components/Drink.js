import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToDrinksCart } from "../actions/cartActions";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Drink({ drink }) {
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.loginUserReducer.currentUser);

    function dispatchAddToDrinksCart() {
        dispatch(addToDrinksCart(drink, quantity));
    }

    function handleOrder() {
        if (currentUser) {
            dispatchAddToDrinksCart();
        } else {
            toast.error('Va rugam sa va logati pentru a putea comanda!', {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 3000
            });
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="shadow p-3 mb-4 bg-white rounded w-100 h-100"
        >
            <div>
                <h1 className="fs-5 text-center">{drink.name}</h1>
                <img
                    src={drink.image}
                    alt={drink.name}
                    className="img-fluid"
                    style={{ height: "200px", width: "100%", objectFit: "contain" }}
                />
            </div>

            <div className="drink-grid-container">
                <div className="m-1 w-100">
                    <select
                        className="form-control"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    >
                        {[...Array(20).keys()].map((x, i) => (
                            <option key={i} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="m-1 w-100">
                    <button onClick={handleOrder} className="book-table-btn">
                        {(drink.prices[0] * quantity).toFixed(2)} RON
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
