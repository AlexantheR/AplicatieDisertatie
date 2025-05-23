import { combineReducers } from "redux";
import { legacy_createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { addPizzaReducer, editPizzaReducer, getAllPizzasReducer, getPizzaByIdReducer } from "./reducers/pizzaReducers";
import { cartReducer } from "./reducers/cartReducer";
import { getAllUsersReducer, loginUserReducer, registerUserReducer } from "./reducers/userReducer";
import { placeOrderReducer, getUserOrdersReducer, getAllOrdersReducer } from "./reducers/orderReducer";
import { getAllDrinksReducer, addDrinkReducer, editDrinkReducer, getDrinkByIdReducer } from "./reducers/drinkReducers";

const finalReducer = combineReducers({
  getAllPizzasReducer: getAllPizzasReducer,
  cartReducer: cartReducer,
  registerUserReducer: registerUserReducer,
  loginUserReducer: loginUserReducer,
  placeOrderReducer: placeOrderReducer,
  getUserOrdersReducer: getUserOrdersReducer,
  addPizzaReducer: addPizzaReducer,
  getPizzaByIdReducer: getPizzaByIdReducer,
  editPizzaReducer: editPizzaReducer,
  getAllOrdersReducer: getAllOrdersReducer,
  getAllUsersReducer: getAllUsersReducer,
  getAllDrinksReducer: getAllDrinksReducer,
  addDrinkReducer: addDrinkReducer,
  getDrinkByIdReducer: getDrinkByIdReducer,
  editDrinkReducer: editDrinkReducer,
});

const cartItems = localStorage.getItem('cartItems') ?
  JSON.parse(localStorage.getItem('cartItems')) : []

const currentUser = localStorage.getItem('currentUser') ?
  JSON.parse(localStorage.getItem('currentUser')) : null

const initialState = {
  cartReducer: {
    cartItems: cartItems
  },
  loginUserReducer: {
    currentUser: currentUser
  }
}
const composeEnhancers = composeWithDevTools({});

const store = legacy_createStore(
  finalReducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;