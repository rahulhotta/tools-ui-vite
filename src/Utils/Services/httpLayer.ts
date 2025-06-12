// utils/http.js
import {Environments} from '../Environments/Environments.ts'
import axios from 'axios';
import { store } from '../Redux/store';
import { showLoader, hideLoader } from '../Redux/loaderSlice';


// Request interceptor to show loader
axios.interceptors.request.use(
  (config) => {
    // Dispatch the showLoader action
    // store.dispatch(showLoader());
    return config;
  },
  (error) => {
    store.dispatch(hideLoader());
    return Promise.reject(error);
  }
);

// Response interceptor to hide loader
axios.interceptors.response.use(
  (response) => {
    store.dispatch(hideLoader());
    return response;
  },
  (error) => {
    store.dispatch(hideLoader());
    return Promise.reject(error);
  }
);

const get = async (endpoint:string, showLoaderFlag = true) => {
    const url = Environments['url']+ endpoint;
  
    // Check if we need to show the loader
    if (showLoaderFlag) {
      store.dispatch(showLoader());  // Dispatch the loader
    }
  
    // const config = {
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //   },
    // };
  
    try {
      // Perform the API request
      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.error("API request failed:", error);
    } finally {
      // Hide the loader after the request completes
      if (showLoaderFlag) {
        store.dispatch(hideLoader());
      }
    }
  };
  
  
  const post = async (endpoint:string, params:unknown, showLoaderFlag = true, cancelToken = undefined) => {
    // let url = "https://e-comm-gateway-dx21dicj.an.gateway.dev" + urlKey;
    const url = Environments['url']+ endpoint;
    // Show the loader if needed
    if (showLoaderFlag) {
      store.dispatch(showLoader());
    }
  
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  
    if (cancelToken !== undefined) {
      config[cancelToken] = cancelToken;
    }
  
    try {
      // Perform the POST request
      const response = await axios.post(url, params, config);
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
    } finally {
      // Hide the loader after the request, whether it succeeds or fails
      if (showLoaderFlag) {
        store.dispatch(hideLoader());
      }
    }
  };
  
  
  const ServiceUtils = {
    getRequest: get,
    postRequest: post,
  };
  export { ServiceUtils };