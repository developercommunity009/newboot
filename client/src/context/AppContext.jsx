
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constant';

// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {

  const [address, setAddress] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("authUser"));
  const [state, setState] = useState(user || null);
  const [getME, setGetME] = useState(false);
  console.log(state)
  // for login
  const loginUser = async (formData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, formData);
      // console.log(response.data)
      localStorage.setItem("authUser", JSON.stringify(response.data.user));
      localStorage.setItem('token', JSON.stringify(response.data.token));
      setGetME(true)
      return response.data;
    } catch (error) {
      console.error('Login error:', error.message);
      throw new Error('Login failed. Please try again.');
    }
  };

  // for SingUP
  const signupUser = async (formData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/signup`, formData);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.message);
      throw new Error('Login failed. Please try again.');
    }
  };


  // for Get Me
  const getMe = async () => {
    console.log("getMe")
    try {
      const response = await axios.get(`${BACKEND_URL}/auth/getme`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Use state token
        },
      });
    console.log(response)
      setState(response.data);  // Update state with response data
      localStorage.setItem("authUser", JSON.stringify(response.data));  // Update localStorage

      return response.data;
    } catch (error) {
      console.error('Login error:', error.message);
      throw new Error('Login failed. Please try again.');
    }
  };






  // for token 
  const deployContract = async (formData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/token/credentials`, { formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Delete Wallet
  const deleteAccount = async (id) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/wallet/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  // for  Wallet creation
  const genratsWallets = async (number) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/wallet/generate-wallets`,
        { number },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error
    }
  }
  // for  Wallet creation
  const genrateMainWallet = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/wallet/generate-main-wallet`, "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState(response.data)
      setGetME(true)
      return response.data;
    } catch (error) {
      throw error
    }
  }

  // for  Auto Fundin To SubWallets
  const autoFundingToSubWallet = async (mainWalletData) => {
    const {wallet , privateKey}=mainWalletData;
    // console.log(wallet , privateKey);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/wallet/autofunding-to-subwallet`, {wallet , privateKey},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGetME(true)
      return response.data;
    } catch (error) {
      throw error
    }
  }



  // Get WalletBy UserID
  const getWalletsByUserId = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/wallet`, // Assuming the endpoint is `/wallet`
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      return response.data.wallets;
    } catch (error) {
      throw error;
    }
  };


  const enableTradingAndBuyToken = async (formData) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/wallet/enable-trading`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const sellTokenFromSubWallets = async (formData) => {
    console.log(formData)
    try {
      const response = await axios.post(
        `${BACKEND_URL}/wallet/enable-trading-sell`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  const transferToken = async (formData) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/wallet/transfer-token`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  const transferEthToMain = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/wallet/transfer-eth-main`,
        "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const transferTokenToMain = async (tokenAddress) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/wallet/transfer-token-main`,
        {tokenAddress},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  const sellToken = async (formData) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/wallet/sell-token`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Trigger getMe whenever state changes
  useEffect(() => {
    console.log("Trigged  === ")
    getMe();  // Fetch user data every time the state changes
  }, [getME]);  // Trigger whenever state changes



  return (
    <AppContext.Provider value={{ transferTokenToMain , transferEthToMain,  sellTokenFromSubWallets , genrateMainWallet, autoFundingToSubWallet ,  enableTradingAndBuyToken, getWalletsByUserId, deleteAccount, setAddress, deployContract, genratsWallets, signupUser, loginUser, address, state, setState, transferToken, sellToken }}>
      {children}
    </AppContext.Provider>
  );
};