import axios from "axios"
import api from "../axiosInstance";
// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
// });


export const checkEmailAvailability = (email) => async (dispatch) => {
    try {
        dispatch({ type: 'CHECK_EMAIL_REQUEST' });

        // const response = await axios.get(`/api/users/checkemail?email=${email}`);
        const response = await api.get(`/api/users/checkemail?email=${email}`);
        const unique = response.data.unique;

        dispatch({ type: 'CHECK_EMAIL_SUCCESS', payload: unique });
        return unique;
    } catch (error) {
        dispatch({ type: 'CHECK_EMAIL_FAILED', payload: error });
        console.log(error);
        return false;
    }
};


export const registerUser = (user) => async dispatch => {

    dispatch({ type: 'USER_REGISTER_REQUEST' })

    try {
        // const response = axios.post('/api/users/register', user)
        const response = await api.post('/api/users/register', user)
        console.log(response)
        dispatch({ type: 'USER_REGISTER_SUCCESS' })
    } catch (error) {
        dispatch({ type: 'USER_REGISTER_FAILED', payload: error })
    }
}


export const loginUser = (user) => async dispatch => {

    dispatch({ type: 'USER_LOGIN_REQUEST' })

    try {
        // const response = await axios.post('/api/users/login', user)
        const response = await api.post('/api/users/login', user)
        console.log(response)
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: response.data })
        localStorage.setItem('currentUser', JSON.stringify(response.data))
        window.location.href = '/'
    } catch (error) {
        dispatch({ type: 'USER_LOGIN_FAILED', payload: error })
    }

}


export const logoutUser = () => dispatch => {
    localStorage.removeItem('currentUser')
    window.location.href = '/login'
}

export const getAllUsers = () => async dispatch => {

    dispatch({ type: 'GET_USERS_REQUEST' })

    try {
        // const response = await axios.get('/api/users/getallusers')
        const response = await api.get('/api/users/getallusers')
        console.log(response);
        dispatch({ type: 'GET_USERS_SUCCESS', payload: response.data })

    } catch (error) {
        dispatch({ type: 'GET_USERS_FAILED', payload: error })
    }

}

export const deleteUser = (userid) => async dispatch => {

    try {
        // await axios.post('/api/users/deleteuser', { userid })
        await api.post('/api/users/deleteuser', { userid })
        alert('Utilizator sters cu succes!')
        window.location.reload()
    } catch (error) {
        alert('Ceva nu a mers bine!')
        console.log(error);
    }

}

export const makeUserPremium = (email) => async (dispatch) => {
    dispatch({ type: 'MAKE_USER_PREMIUM_REQUEST' });

    try {
        // const response = await axios.post('/api/users/makeuserpremium', { email });
        const response = await api.post('/api/users/makeuserpremium', { email });
        console.log(response);
        dispatch({ type: 'MAKE_USER_PREMIUM_SUCCESS', payload: response.data });

        // Update the local storage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            currentUser.isPremium = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        alert('Utilizatorul a fost marcat ca Premium!');
        setTimeout(() => {
            window.location.reload()
        }, 500);
    } catch (error) {
        dispatch({ type: 'MAKE_USER_PREMIUM_FAILED', payload: error });
        alert('Ceva nu a mers bine!');
        console.log(error);
    }
};


export const loseUserPremium = (email) => async (dispatch) => {
    dispatch({ type: 'LOSE_USER_PREMIUM_REQUEST' });

    try {
        // const response = await axios.post('/api/users/loseuserpremium', { email });
        const response = await api.post('/api/users/loseuserpremium', { email });
        console.log(response);
        dispatch({ type: 'LOSE_USER_PREMIUM_SUCCESS', payload: response.data });

        // Update the local storage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            currentUser.isPremium = false;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        alert('Utilizatorul a pierdut statutul de Premium!');
        setTimeout(() => {
            window.location.reload()
        }, 500);
    } catch (error) {
        dispatch({ type: 'LOSE_USER_PREMIUM_FAILED', payload: error });
        alert('Ceva nu a mers bine!');
        console.log(error);
    }
};


export const updateUserPremiumStatus = (updatedUser) => {
    return { type: 'UPDATE_USER_PREMIUM_STATUS', payload: updatedUser };
};
