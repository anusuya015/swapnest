import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_RESET,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_REVIEW_REQUEST,
  PRODUCT_REVIEW_SUCCESS,
  PRODUCT_REVIEW_FAIL,
} from "../types/productConstants";
import { PRODUCT_REVIEW_DELETE_SUCCESS, PRODUCT_REVIEW_DELETE_FAIL } from '../types/productConstants';
const BACKEND_URL = "https://swapnest-backend.onrender.com";
export const deleteProductReview = (productId, reviewId) => async (dispatch, getState) => {
  try {
    const { userLogin: { userData } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    await axios.delete(`${BACKEND_URL}/api/products/${productId}/reviews/${reviewId}`, config);

    dispatch({ type: PRODUCT_REVIEW_DELETE_SUCCESS, payload: reviewId });
  } catch (error) {
    dispatch({
      type: PRODUCT_REVIEW_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
// ✅ Fetch all products with search & pagination
export const listProducts =
  (keyword = "", pageNumber = "", category = "All") =>
  async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST });

      let url = `${BACKEND_URL}/api/products?keyword=${keyword}&pageNumber=${pageNumber}`;
      if (category && category !== "All Categories") url += `&category=${encodeURIComponent(category)}`;

      console.log("Fetching URL:", url); // ✅ Debugging

      const { data } = await axios.get(url);

      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// ✅ Fetch product details by ID
export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`${BACKEND_URL}/api/products/${id}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Delete a product
export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST });

    const {
      userLogin: { userData },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    await axios.delete(`${BACKEND_URL}/api/products/${id}`, config);

    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


// ✅ Create a new product
export const createProduct =
  (name, images, description, category, expiresOn, address, shippingCharge, price, negotiable) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_CREATE_REQUEST });

      const {
        userLogin: { userData },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const { data } = await axios.post(
        `${BACKEND_URL}/api/products`,
        {
          name,
          images: Array.isArray(images) ? images : [images],
          description,
          category,
          expiresOn,
          address,
          shippingCharge,
          price,
          negotiable,
        },
        config
      );

      dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PRODUCT_CREATE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// ✅ Update a product
export const updateProduct =
  (id, name, images, description, category, expiresOn, address, shippingCharge, price, negotiable) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_UPDATE_REQUEST });

      const {
        userLogin: { userData },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const { data } = await axios.put(
        `${BACKEND_URL}/api/products/${id}`,
        {
          name,
          images: Array.isArray(images) ? images : [images],
          description,
          category,
          expiresOn,
          address,
          shippingCharge,
          price,
          negotiable,
        },
        config
      );

      dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PRODUCT_UPDATE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// ✅ Create a product review
export const createProductReview =
  (productId, comment) => async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_REVIEW_REQUEST });

      const {
        userLogin: { userData },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      };

      await axios.post(`${BACKEND_URL}/api/products/${productId}/reviews`, { comment }, config);

      dispatch({ type: PRODUCT_REVIEW_SUCCESS });
    } catch (error) {
      dispatch({
        type: PRODUCT_REVIEW_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
