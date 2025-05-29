import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Drink from "../components/Drink";
import { getAllDrinks } from "../actions/drinkActions";
import Loading from "../components/Loading";
import Error from "../components/Error";
import FilterDrinks from "../components/FilterDrinks";

export default function DrinksMenu() {

    const dispatch = useDispatch();

    const drinksstate = useSelector(state => state.getAllDrinksReducer)

    const { drinks, error, loading } = drinksstate;

    useEffect(() => {
        dispatch(getAllDrinks());
    }, [])

    return (
        <div>
            <FilterDrinks />
            {loading ? (
                <Loading />
            ) : error ? (
                <Error error="Ceva nu a mers bine!!" />
            ) : (
                <div className="drinks-grid">
                    {drinks.map((drink) => (
                        <div key={drink._id}>
                            <Drink drink={drink} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}