import axios from 'axios'
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_RESET,
  EMAIL_SEND_FAIL,
  EMAIL_SEND_SUCCESS,
  EMAIL_SEND_REQUEST,
  EMAIL_RESET,
  USER_LIST_FAIL,
  USER_LIST_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_RESET,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_VERIFICATION_LINK_REQUEST,
  USER_VERIFICATION_LINK_SUCCESS,
  USER_VERIFICATION_LINK_FAIL,
  USER_VERIFICATION_LINK_RESET,
} from '../types/userConstants'


const BACKEND_URL = "https://swapnest-backend.onrender.com";  
export const login = (email, password) => async (dispatch) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data }); // 🔥 Ensure token is in data
    } else {
      dispatch({ type: USER_LOGIN_FAIL, payload: data.message });
    }
  } catch (error) {
    dispatch({ type: USER_LOGIN_FAIL, payload: error.message });
  }
};


// Logout user
export const logout = () => (dispatch) => {
  localStorage.removeItem('userData')
  dispatch({ type: USER_LOGOUT })
  dispatch({ type: USER_REGISTER_RESET })
  dispatch({ type: USER_LIST_RESET })
  dispatch({ type: USER_UPDATE_RESET })
  dispatch({ type: USER_VERIFICATION_LINK_RESET })
  dispatch({ type: USER_DETAILS_RESET }) // Reset user details on logout
}

// Register user (email verification step)
export const verify = (name, email, password, phone_no, address) => async (dispatch) => {
  try {
    dispatch({ type: USER_VERIFICATION_LINK_REQUEST })

    const config = { headers: { 'Content-Type': 'application/json' } }

    const { data } = await axios.post(
      `${BACKEND_URL}/api/users/verificationlink`,
      { name, email, password, contact: { phone_no }, address },
      config
    )

    dispatch({ type: USER_VERIFICATION_LINK_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER_VERIFICATION_LINK_FAIL,
      payload: error.response?.data.message || error.message,
    })
  }
}

// Register user (final step)
export const register = (token) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST })

    const config = { headers: { 'Content-Type': 'application/json' } }

    const { data } = await axios.post(`${BACKEND_URL}/api/users`, { token }, config)

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data })
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })

    localStorage.setItem('userData', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data.message || error.message,
    })
  }
}

// Send email
export const sendEmail = (receiver, text, name, address, productName, email, phone_no) => async (dispatch, getState) => {
  try {
    dispatch({ type: EMAIL_SEND_REQUEST })

    const { userLogin: { userData } } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData.token}`,
      },
    }

    const { data } = await axios.post(
      `${BACKEND_URL}/api/users/email`,
      { receiver, text, name, address, productName, email, phone_no },
      config
    );

    dispatch({ type: EMAIL_SEND_SUCCESS, payload: data });

    // Reset email state after 5 seconds
    setTimeout(() => {
      dispatch({ type: EMAIL_RESET })
    }, 5000)
  } catch (error) {
    dispatch({
      type: EMAIL_SEND_FAIL,
      payload: error.response?.data.message || error.message,
    })
  }
}

// Get all users (admin)
export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST })

    const { userLogin: { userData } } = getState()
    const config = { headers: { Authorization: `Bearer ${userData.token}` } }

    const { data } = await axios.get(`${BACKEND_URL}/api/users`, config)

    dispatch({ type: USER_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.response?.data.message || error.message,
    })
  }
}

// Delete user (admin)
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST })

    const { userLogin: { userData } } = getState()
    const config = { headers: { Authorization: `Bearer ${userData.token}` } }

    await axios.delete(`${BACKEND_URL}/api/users/${id}`, config)

    dispatch({ type: USER_DELETE_SUCCESS })
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response?.data.message || error.message,
    })
  }
}

// Update user details
export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST })

    const { userLogin: { userData } } = getState()
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData.token}`,
      },
    }

    const { data } = await axios.put(`${BACKEND_URL}/api/users/${user._id}`, user, config)

    dispatch({ type: USER_UPDATE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response?.data.message || error.message,
    })
  }
}

// Get user details
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST })

    const { userLogin: { userData } } = getState()
    const config = { headers: { Authorization: `Bearer ${userData.token}` } }

    const { data } = await axios.get(`${BACKEND_URL}/api/users/${id}`, config)

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message = error.response?.data.message || error.message

    if (message === 'Not authorized, token failed') {
      // Attempt token refresh before logout (if implemented)
      // Example: dispatch(refreshTokenAction())
      dispatch(logout())
    }

    dispatch({ type: USER_DETAILS_FAIL, payload: message })
  }
}
