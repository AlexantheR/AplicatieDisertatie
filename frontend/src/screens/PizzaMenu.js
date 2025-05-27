import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pizza from "../components/Pizza";
import { getAllPizzas } from "../actions/pizzaActions";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Filter from "../components/Filter";
import { Row, Col } from "react-bootstrap";

export default function PizzaMenu() {

  const dispatch = useDispatch();

  const pizzasstate = useSelector(state => state.getAllPizzasReducer)

  const { pizzas, error, loading } = pizzasstate;

  console.log("PizzaMenu loaded");

  useEffect(() => {
    dispatch(getAllPizzas());
  }, [])

  return (
    <div>
      <Filter />
      <div className="row justify-content-center" >

        {loading ? (
          <Loading />
        ) : error ? (
          <Error error='Ceva nu a mers bine!!' />
        ) : (
          <Row className="justify-content-center">
            {pizzas.length === 1 ? (
              <div className="single-pizza-container">
                <Col xs={12} sm={12} md={8} lg={6} xl={4}>
                  <Pizza pizza={pizzas[0]} />
                </Col>
              </div>
            ) : (
              pizzas.map(pizza => (
                <Col xs={12} sm={6} md={4} lg={3} key={pizza._id}>
                  <Pizza pizza={pizza} />
                </Col>
              ))
            )}
          </Row>


        )}

      </div>
    </div>
  );
}
