import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const getAllPizzas = () => async dispatch => {
  dispatch({ type: "GET_PIZZAS_REQUEST" });

  try {
    // const response = await axios.get("/api/pizzas/getallpizzas");
    const response = await api.get("/api/pizzas/getallpizzas");
    console.log(response);
    console.log("raspuns api pizzas", response.data);
    console.log("BASE URL:", process.env.REACT_APP_API_URL);
    dispatch({ type: "GET_PIZZAS_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "GET_PIZZAS_FAILED", payload: error });
  }
};


export const getPizzaById = (pizzaid) => async dispatch => {
  dispatch({ type: 'GET_PIZZABYID_REQUEST' })

  try {
    // const response = await axios.post("/api/pizzas/getpizzabyid", { pizzaid });
    const response = await api.post("/api/pizzas/getpizzabyid", { pizzaid });
    console.log(response);
    dispatch({ type: "GET_PIZZABYID_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "GET_PIZZABYID_FAILED", payload: error });
  }
}


export const filterPizzas = (searchkey, category) => async dispatch => {
  dispatch({ type: 'GET_PIZZAS_REQUEST' })

  try {
    var filteredPizzas;
    // const response = await axios.get('/api/pizzas/getallpizzas')
    const response = await api.get('/api/pizzas/getallpizzas')
    filteredPizzas = response.data.filter(pizza => pizza.name.toLowerCase().includes(searchkey))

    if (category != 'all') {
      filteredPizzas = response.data.filter(pizza => pizza.category.toLowerCase() == category)
    }
    dispatch({ type: 'GET_PIZZAS_SUCCESS', payload: filteredPizzas })
  } catch (error) {
    dispatch({ type: "GET_PIZZAS_FAILED", payload: error });
  }
}


export const addPizza = (pizza) => async dispatch => {
  dispatch({ type: 'ADD_PIZZA_REQUEST' })

  try {
    // const response = await axios.post('/api/pizzas/addpizza', { pizza })
    const response = await api.post('/api/pizzas/addpizza', { pizza })   
    console.log(response);
    dispatch({ type: 'ADD_PIZZA_SUCCESS' })
  } catch (error) {
    dispatch({ type: 'ADD_PIZZA_FAILED', payload: error })
  }
}

export const editPizza = (editedpizza) => async dispatch => {
  dispatch({ type: 'EDIT_PIZZA_REQUEST' })
  try {
    // const response = await axios.post('/api/pizzas/editpizza', { editedpizza })
    const response = await api.post('/api/pizzas/editpizza', { editedpizza })
    console.log(response);
    dispatch({ type: 'EDIT_PIZZA_SUCCESS' })
    window.location.href = '/admin/pizzaslist'
  } catch (error) {
    dispatch({ type: 'EDIT_PIZZA_FAILED', payload: error })
  }
}


export const deletePizza = (pizzaid) => async dispatch => {

  try {
    // const response = await axios.post('/api/pizzas/deletepizza', { pizzaid })
    const response = await api.post('/api/pizzas/deletepizza', { pizzaid })
    toast.success('Pizza stearsa cu succes!', {
      position: toast.POSITION.BOTTOM_CENTER // Set the toast position to bottom-center
    })
    console.log(response);
    window.location.reload()
  } catch (error) {
    toast.error('Ceva nu a mers bine!', {
      position: toast.POSITION.BOTTOM_CENTER // Set the toast position to bottom-center
    })
    console.log(error);
  }


}