import axios from 'axios'
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

const token = getState().loginUserReducer.currentUser.token;


export const placeOrderCard = (token, subtotal) => async (dispatch, getState) => {
    dispatch({ type: 'PLACE_ORDER_REQUEST' });
    const currentUser = getState().loginUserReducer.currentUser;
    const cartItems = getState().cartReducer.cartItems;

    try {
        const tokenJWT = currentUser.token;
        const response = await api.post('/api/orders/placeorder/card', {
            token,
            subtotal,
            currentUser,
            cartItems,
        }, {
            headers: {
                Authorization: `Bearer ${tokenJWT}`
            }
        });


        dispatch({ type: 'PLACE_ORDER_SUCCESS' });
        console.log(response);

        localStorage.removeItem('cartItems');
        setTimeout(() => {
            window.location.reload()
        }, 2000);
    } catch (error) {
        dispatch({ type: 'PLACE_ORDER_FAILED' });
        console.log(error);
    }
};

export const placeOrderRamburs = (orderDetails) => async (dispatch, getState) => {
    dispatch({ type: 'PLACE_ORDER_REQUEST' });
    const currentUser = getState().loginUserReducer.currentUser;
    const cartItems = getState().cartReducer.cartItems;

    try {
        // const response = await axios.post('/api/orders/placeorder/cash', {
        const tokenJWT = currentUser.token;
        const response = await api.post('/api/orders/placeorder/cash', {
            token: orderDetails.token,
            subtotal: orderDetails.subtotal,
            currentUser,
            cartItems,
        }, {
            headers: {
                Authorization: `Bearer ${tokenJWT}`
            }
        });


        dispatch({ type: 'PLACE_ORDER_SUCCESS' });
        console.log(response);

        localStorage.removeItem('cartItems');
        setTimeout(() => {
            window.location.reload()
        }, 2000);
    } catch (error) {
        dispatch({ type: 'PLACE_ORDER_FAILED' });
        console.log(error);
    }
};



// export const placeOrder = (token, subtotal) => async (dispatch) => {
//     dispatch({ type: 'PLACE_ORDER_REQUEST' });

//     try {
//         const response = await axios.post('/api/orders/placeorder', {
//             token,
//             subtotal,
//         });

//         dispatch({ type: 'PLACE_ORDER_SUCCESS' });
//         console.log(response.data);
//     } catch (error) {
//         dispatch({ type: 'PLACE_ORDER_FAILED' });
//         console.log(error);
//     }
// };


export const getUserOrders = () => async (dispatch, getState) => {

    const currentUser = getState().loginUserReducer.currentUser
    dispatch({ type: "GET_USER_ORDERS_REQUEST" });

    try {
        // const response = await axios.post("/api/orders/getuserorders", { userid: currentUser._id });
        const tokenJWT = currentUser.token;
        const response = await api.post("/api/orders/getuserorders", { userid: currentUser._id }, {
            headers: {
                Authorization: `Bearer ${tokenJWT}`
            }
        });

        console.log(response);

        dispatch({ type: "GET_USER_ORDERS_SUCCESS", payload: response.data });
    } catch (error) {
        dispatch({ type: "GET_USER_ORDERS_FAILED", payload: error });
    }
};

export const getAllOrders = () => async (dispatch, getState) => {
    const currentUser = getState().loginUserReducer.currentUser
    dispatch({ type: 'GET_ALL_ORDERS_REQUEST' })

    try {
        // const response = await axios.get('/api/orders/getallorders')
        const tokenJWT = currentUser.token;
        const response = await api.get('/api/orders/getallorders', {
            headers: {
                Authorization: `Bearer ${tokenJWT}`
            }
        });
        console.log(response)
        dispatch({ type: 'GET_ALLORDERS_SUCCESS', payload: response.data })
    } catch (error) {
        dispatch({ type: 'GET_ALLORDERS_FAILED', payload: error })
    }
}


export const deliverOrder = (orderid) => async dispatch => {

    try {
        // const response = await axios.post('/api/orders/deliverorder', { orderid })
        const tokenJWT = getState().loginUserReducer.currentUser.token;
        const response = await api.post('/api/orders/deliverorder', { orderid }, {
            headers: {
                Authorization: `Bearer ${tokenJWT}`
            }
        });
        console.log(response)
        toast.success('Comanda trimisa', {
            position: toast.POSITION.BOTTOM_CENTER // Set the toast position to bottom-center
        })

        // const orders = await axios.get('/api/orders/getallorders')
        const orders = await api.get('/api/orders/getallorders')
        dispatch({ type: 'GET_ALLORDERS_SUCCESS', payload: orders.data })
    } catch (error) {
        console.log(error)
    }
}

export const cancelOrder = (orderid) => async (dispatch) => {
    try {
        // const response = await axios.post('/api/orders/cancelorder', { orderid });
        const tokenJWT = getState().loginUserReducer.currentUser.token;
        const response = await api.post('/api/orders/cancelorder', { orderid }, {
            headers: {
                Authorization: `Bearer ${tokenJWT}`
            }
        });
        console.log(response);
        toast.success('Comanda anulata', {
            position: toast.POSITION.BOTTOM_CENTER // Set the toast position to bottom-center
        });

        // const orders = await axios.get('/api/orders/getallorders');
        const orders = await api.get('/api/orders/getallorders');
        dispatch({ type: 'GET_ALLORDERS_SUCCESS', payload: orders.data });
    } catch (error) {
        console.log(error);
    }
};

