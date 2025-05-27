import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";


import Addpizza from "./Addpizza";
import Adddrink from "./Adddrink";
import Editpizza from "./Editpizza";
import Editdrink from "./Editdrink";
import Orderslist from "./Orderslist";
import Pizzaslist from "./Pizzaslist";
import Drinkslist from "./Drinkslist";
import Userslist from "./Userslist";
import Graph from "./Graph";
import { getAllOrders } from "../actions/orderActions";
import { getAllUsers } from "../actions/userActions";

export default function Adminscreen() {
    const userstate = useSelector((state) => state.loginUserReducer);
    const { currentUser } = userstate;

    const allOrders = useSelector((state) => state.getAllOrdersReducer);
    const { orders, loading, error } = allOrders || {}; // Add a default value of an empty object

    const allUsers = useSelector((state) => state.getAllUsersReducer);
    const { users } = allUsers || {}; // Add a default value of an empty object

    const dispatch = useDispatch();

    useEffect(() => {
        if (!currentUser.isAdmin) {
            window.location.href = "/";
        }
    }, []);

    useEffect(() => {
        dispatch(getAllOrders());
        dispatch(getAllUsers());
    }, [dispatch]);

    return (
        <div>
            <div className="row justify-content-center p-3">
                <div className="col-md-10">
                    <h2 style={{ fontSize: "35px" }}>Panou Admin</h2>

                    <ul className="adminfunctions" style={{ backgroundColor: '#E74646' }}>
                        <li>
                            <Link to={'/admin/userslist'} style={{ color: 'white' }}>Lista utilizatori</Link>
                        </li>
                        <li>
                            <Link to={'/admin/pizzaslist'} style={{ color: 'white' }}>Lista pizza</Link>
                        </li>
                        <li>
                            <Link to={'/admin/drinkslist'} style={{ color: 'white' }}>Lista bauturi</Link>
                        </li>
                        <li>
                            <Link to={'/admin/addpizza'} style={{ color: 'white' }}>Adauga pizza</Link>
                        </li>
                        <li>
                            <Link to={'/admin/adddrink'} style={{ color: 'white' }}>Adauga bautura</Link>
                        </li>
                        <li>
                            <Link to={'/admin/orderslist'} style={{ color: 'white' }}>Lista comenzi</Link>
                        </li>
                        <li>
                            <Link to={'/admin/graph'} style={{ color: 'white' }}>Situatii raportare</Link>
                        </li>
                    </ul>

                    <Routes>
                        <Route path="/" element={<Userslist />} />
                        <Route path="userslist" element={<Userslist />} />
                        <Route path="orderslist" element={<Orderslist />} />
                        <Route path="pizzaslist" element={<Pizzaslist />} />
                        <Route path="drinkslist" element={<Drinkslist />} />
                        <Route path="addpizza" element={<Addpizza />} />
                        <Route path="adddrink" element={<Adddrink />} />
                        <Route path="editpizza/:pizzaid" element={<Editpizza />} />
                        <Route path="editdrink/:drinkid" element={<Editdrink />} />
                        <Route
                            path="graph"
                            element={
                                loading ? (
                                    <div>Loading...</div>
                                ) : error ? (
                                    <div>Error: {error}</div>
                                ) : (
                                    <Graph orders={orders} users={users} />
                                )
                            }
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
