
import { React, useContext, useEffect, useState } from "react";
import { input, Input } from "@material-tailwind/react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { AppContext } from "./context/AppContext";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ethers } from 'ethers';
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { motion } from "framer-motion";
const provider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/1GyaWdstqAQDyIWjedYVRtxZu106iVG5");


const Sniper = () => {


  const { genratsWallets, setGetME, transferTokenToMain, transferEthToMain, sellTokenFromSubWallets, autoFundingToSubWallet, genrateMainWallet, transferToken, sellToken, deleteAccount, address, getWalletsByUserId, setAddress, enableTradingAndBuyToken, state } = useContext(AppContext);
  const items = [{ text: 1 }, { text: 2 }, { text: 3 }, { text: 4 }];
  const [shouldFetch, setShouldFetch] = useState(false);
  const [showicon, setshowicon] = useState();
  const [showloader, setLoader] = useState("none");
  const [showloader1, setLoader1] = useState("none");
  const [showloader2, setLoader2] = useState("flex");
  const [showloader3, setLoader3] = useState("none");
  const [showloader4, setLoader4] = useState("flex");


  const [tokenAmounts, setTokenAmounts] = useState({});
  const [sellTokenAmounts, setSellTokenAmounts] = useState({});
  const [balances, setBalances] = useState({});

  const [ethAmounts, setETHAmounts] = useState('');

// console.log("sellTokenAmounts",sellTokenAmounts)
  const TRADING = 'Buy From  Sub Wallets';
  const SELL = 'Sell From Sub Wallets';
  const TRANSFER = 'Tokens Transfer To Main Wallet';
  const TRANSFER_ETH = 'ETHs Transfer To Main Wallet';

  // State to track the selected option and dropdown visibility
  const [selectedOption, setSelectedOption] = useState("Actions"); // Default to 'Buy From All Sub Wallets'
  const [dropdownOpen, setDropdownOpen] = useState(false); // Control dropdown visibility
  const [tokenAddress, setTokenAddress] = useState("");

  // Handle the input change event
  const handleChangeforAddress = (e) => {
    setTokenAddress(e.target.value);
  };

  const [number, setNumber] = useState();
  const [texHash, setTexHash] = useState('');
  const [showPopup, setShowPopup] = useState("");
  const [showSendPopup, setShowsendpopup] = useState(false)
  const [showTransferPopup, setShowTransferPopup] = useState(false);
  // const [showTransferpup, setShowTransferpup] = useState('')
  const [showTexHash, setShowTexHash] = useState(false); // State for showing texHash




  const [transferPopup, setTransferPopup] = useState({
    tokenAddress,
    toAddress: '',
    privateKey: '',
    amountInTokens: ''
  });

  const [sellPopup, setSellPopup] = useState({
    tokenAddress,
    // privateKey: '',
    amountInTokens: ''
  });

  const [transferPopupToMain, setTransferPopupToMain] = useState({
    tokenAddress: ''
  });



  const handleChangeTransfer = (e) => {
    const { name, value } = e.target;
    setTransferPopup({
      ...transferPopup,
      [name]: value,
    });
  };

  const handleChangeSell = (e) => {
    const { name, value } = e.target;
    setSellPopup({
      ...sellPopup,
      [name]: value,
    });
  };

  const handleChangeTrans = (e) => {
    const { name, value } = e.target;
    setTransferPopupToMain({
      ...transferPopupToMain,
      [name]: value,
    });
  };

  const [loadingItemIndex, setLoadingItemIndex] = useState(null); // null means no loader is active




  // Handler for selecting options
  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
    // Close the dropdown after selecting
  };

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    // Function to fetch the balance for each wallet
    const fetchBalances = async () => {
      const updatedBalances = {};
      for (let i = 0; i < address.length; i++) {
        try {
          const balance = await provider.getBalance(address[i].walletAddress);
          updatedBalances[address[i].walletAddress] = ethers.utils.formatEther(balance);
        } catch (error) {
          console.error(`Error fetching balance for ${address[i].walletAddress}:`, error);
          updatedBalances[address[i].walletAddress] = "Error";
        }
      }
      setBalances(updatedBalances);
    };

    // Call the fetchBalances function if address array is not empty
    if (address.length > 0) {
      fetchBalances();
    }
  }, [address]);


  const fetchWallets = async () => {
    try {
      const wallets = await getWalletsByUserId();
      setAddress(wallets);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [shouldFetch]);

  const loader = async (a) => {
    setLoader("flex");
    // console.log(a);
    try {
      const result = await genratsWallets(a);
      fetchWallets()
      setAddress(result.wallets);
    } catch (error) {
      console.error("Error generating wallets:", error);
    } finally {
      setTimeout(() => {
        setLoader("none");
      }, 2000); // 2 seconds
    }
  };

  const createMainWallet = async () => {
    setLoader1("flex")
    try {
      const result = await genrateMainWallet();
      if (result) {
        setGetME(true)
      }
      setLoader1("none")
    } catch (error) {
      console.error("Error generating wallets:", error);
    }
  };

  

    const autoFundingToSubWallets = async () => {
      
      setLoader3("flex");
      const mainWalletData = {
        wallet: state?.mainWallet?.walletAddress,
        privateKey: state?.mainWallet?.privateKey,
        ethAmounts : ethAmounts
  
      }
    try {
      const result = await autoFundingToSubWallet(mainWalletData);
      
      setLoader3("none");

    } catch (error) {
      
      setLoader3("none");
      console.error("Error generating wallets:", error);
    } finally {
      setTimeout(() => {
        setLoader3("none");

        setLoader("none");
      }, 2000); // 2 seconds
    }
  };


  // setShouldFetch
  function handleDelete(id) {
    const confirmed = window.confirm("Do you want to delete this wallet?");
    if (confirmed) {
      deleteAccount(id);
      fetchWallets();
      setShouldFetch(prev => !prev); // Trigger re-fetching of wallets
    }
  }

  // Function to handle Eth amount change
  const handleTokenAmountChange = (e, index) => {
    const newAmount = e.target.value;
    setTokenAmounts({
      ...tokenAmounts,
      [index]: newAmount,
    });
  }

  // Function to handle token amount change
  const handleSellTokenAmountChange = (e, index) => {
    const newAmount = e.target.value;
    setSellTokenAmounts({
      ...sellTokenAmounts,
      [index]: newAmount,
    });
  };


  // Function to get corresponding wallet address and private key
  const getCorrespondingData = (index) => {
    if (address[index]) {
      return {
        privateKey: address[index].privateKey,
      };
    }
    return null;
  };

  const handleTrading = async () => {


    try {
      // Collect data for all indices where tokenAmounts have values
      const correspondingDataArray = Object.keys(tokenAmounts).map(index => {
        const data = getCorrespondingData(Number(index)); // Ensure index is a number
        return data ? {
          ...data,
          tokenAmount: tokenAmounts[index], // Include the token amount
        } : null;
      }).filter(data => data !== null); // Remove null entries

      // Combine formData with the array of corresponding data
      const combinedData = {
        tokenAddress,
        correspondingData: correspondingDataArray, // Add the array to formData
      };

      // console.log(combinedData); // Debugging output

      // Send combined data to the backend
      setLoader1("flex")
      const result = await enableTradingAndBuyToken(combinedData);

      // Update state with the transaction hash or relevant information
      setLoader1("none")
      alert("Sucussfully Bundle Transactions is completed");

      setTexHash(result.message);
      setShowTexHash(true); // Show texHash

      setTimeout(() => {
        setShowTexHash(false); // Hide after 1 minute
      }, 60000);

    } catch (error) {
      setLoader1("none")

      console.error('Error submitting form:', error);
    }
  };




  const handleSellTrading = async () => {

    try {

      // Collect data for all indices where tokenAmounts have values
      const correspondingDataArray = Object.keys(sellTokenAmounts).map(index => {
        const data = getCorrespondingData(Number(index)); // Ensure index is a number
        return data ? {
          ...data,
          tokenAmount: sellTokenAmounts[index], // Include the token amount
        } : null;
      }).filter(data => data !== null); // Remove null entries

      // Combine formData with the array of corresponding data
      const combinedData = {
        // ...formData,
        correspondingData: correspondingDataArray, // Add the array to formData
        tokenAddress: tokenAddress,      // Add tokenAddress from the state
      };


      setLoader1("flex");

      // Call the function to sell tokens from sub-wallets
      const result = await sellTokenFromSubWallets(combinedData);

      // Handle the result and update UI
      setLoader1("none");
      // alert("Successfully Bundle Transactions are completed");

      setTexHash(result.message); // Assuming result contains the transaction message
      setShowTexHash(true); // Show transaction hash

      // Hide the transaction hash after 1 minute
      setTimeout(() => {
        setShowTexHash(false);
      }, 60000);

    } catch (error) {
      setLoader1("none");

      console.error('Error submitting form:', error);
    }
  };


  const copyToClipboard = () => {
    navigator.clipboard.writeText(texHash);
    alert("Transaction Hash copied to clipboard!");
  };

  const transferPopUp = (key,) => {
    setTransferPopup({
      privateKey: key,
    })
    setShowPopup(true);
  }

  const sellPopUp = () => {
    setShowsendpopup(true);
  }


  const transferTokenToAddress = async (privateKey ,  mainWalletAddress , sellTokenAmounts , i) => {
    try {
      const transferData ={
        tokenAddress,
        toAddress: mainWalletAddress,
        privateKey,
        amountInTokens:sellTokenAmounts
      }

      setLoadingItemIndex(i);


      // setLoader2("flex");
      const transfer = await transferToken(transferData);
      // setLoader2("none");
      setLoadingItemIndex(null);

      if (transfer.transactionHash) {
        alert("You Transcation Success with  Hash", transfer.transactionHash)
      }
    } catch (error) {
      setLoader2("none");
      setLoadingItemIndex(null);


      console.error("Error fetching wallets:", error);
    }
  }
  //=============================================================================================
  const transTokenToMain = async () => {
    try {
      setLoader1("flex");
      const transfer = await transferTokenToMain(tokenAddress);
      setLoader1("none");
    } catch (error) {
      setLoader1("none");

      console.error("Error fetching wallets:", error);
    }
  }
  const transferETHEToMain = async () => {
    try {
      setLoader1("flex");

      const transfer = await transferEthToMain();
      setLoader1("none");

      // if (transfer.transactionHash) {
      //   alert("You Transcation Success with  Hash", transfer.transactionHash)
      // }

    } catch (error) {
      setLoader1("none");
      console.error("Error fetching wallets:", error);
    }
  }


  const sellTokenTo = async (privateKey , sellTokenAmounts , i) => {
    const sellData = {
      tokenAddress,
      privateKey,
      amountInTokens: sellTokenAmounts
    };
    try {
      setLoadingItemIndex(i);

      const sell = await sellToken(sellData);
      setLoadingItemIndex(null);

      if (sell.transactionHash) {
        alert("You Transcation Success with  Hash", sell.transactionHash)
      }
    } catch (error) {
      setLoadingItemIndex(null);

      console.error("Error fetching wallets:", error);
    }
  }

  return (
    <div className="px-4 relative max-w-[1500px] mx-auto  text-white md:px-16 py-8 ">

      <h1 className="gradient-bg text-center text-[38px]  md:text-[72px] font-bold">
        Bundle & snipers
      </h1>
      <div className="bg-[#292929] relative border-x-[6px] border-x-[#34d399] shadow-bg px-4 md:px-8 py-8 rounded-lg">


        <div className="flex-col w-full mt-2  flex justify-start gap-2 items-start ">
          <h1 className="text-white text-[14px] md:text-[18px]">Token Address</h1>
          <Input
            name="tokenAddress"
            color="teal"
            className="rounded-lg bg-gray-600/30 text-white"
            label="Token Address"
            value={tokenAddress} // Bind the value to the state
            onChange={handleChangeforAddress} // Update the state on input change
          />
        </div>
        <div className="pt-8">

          {!state?.mainWallet && (
            <h1 className="main-wallet-h1 text-white md:text-[18px] text-[14px]">
              Create Main Wallet:
            </h1>
          )}

          {state?.mainWallet ? (
            <>
              <div className="flex mt-5 relative gap-4 flex-col justify-between w-full px-4 py-4 border-2 border-[#09f774]" >
                <div className="flex justify-between items-center">
                  <h1 className="flex flex-col md:flex-row justify-start items-start text-[8px] md:text-[18px]">
                    <span className="text-[#09f774]">Main Wallet address:</span>
                    {state?.mainWallet?.walletAddress}
                  </h1>

                </div>

                <h1 className="flex flex-col md:flex-row justify-start items-start text-[12px] md:text-[18px]">
                  <span className="text-[#09f774]">Main Wallet Balance:</span>
                  {balances[state?.mainWallet?.walletAddress] !== undefined ? `${balances[state?.mainWallet?.walletAddress]} ETH` : "Loading..."}
                </h1>

                <h1 className="flex flex-col text-wrap md:flex-row justify-start items-start text-[6px] md:text-[18px]">
                  <span className="text-[#09f774]">Key:</span>
                  {state?.mainWallet?.privateKey}
                </h1>

                <h1 className="flex flex-col text-wrap md:flex-row justify-start items-start text-[6px] md:text-[18px]">
                  <span className="text-[#09f774]">ETH Amount For send:</span>
                  
                </h1>

                <Input
                      placeholder="ETH amount"
                      labelProps={{ className: "hidden" }}
                      className="!border-2 !border-[#34d399] !w-[200px] shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#34d399] focus:!border-t-[#34d399] focus:ring-gray-900/10 rounded-lg bg-gray-600/30 text-white"
                      label="Token amount"
                      value={ethAmounts}
                      onChange={(e) => setETHAmounts(e.target.value)}
                    />


                  <div className="flex justify-center mt-4 items-center" style={{ display: showloader3 }}>
                    <div className="w-20 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
                      <span className="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]"></span>
                    </div>
                  </div>
                

                <button className="group/button relative mt-5 inline-flex items-center justify-center overflow-hidden rounded-md bg-grade backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-[#09f774]/30 border border-#09f774/20"
                  onClick={autoFundingToSubWallets}>
                  <span className="md:text-[18px] text-[14px]">AutoFunding To SubWallet</span>
                </button>
              </div>

            </>
          ) : (
            <div className="flex justify-start ml-10 flex-wrap items-start  gap-4" onClick={createMainWallet}>
              <button className="group/button relative mt-5 inline-flex items-center justify-center overflow-hidden rounded-md bg-grade backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-[#09f774]/30 border border-#09f774/20">
                <span className="md:text-[18px] text-[14px]">Create Main Wallet</span>
              </button>
            </div>
          )}

          
        </div>

        <div className="pt-8">
          <h1 className="text-white  md:text-[18px] text-[14px]">Bundle:</h1>
          <p className="md:pl-16  md:text-[18px] text-[14px] ">
            How many  Sub-Wallets do you want to create ? :
          </p>
          <div className="flex justify-center flex-wrap items-center pt-4 gap-4">
            {items.map((i, index) => (


              <button
                key={index}
                onClick={() => loader(index + 1)}
                className="relative overflow-hidden rounded-lg h-[40px] group w-[108px] md:w-[130px] hover:animate-pulse hover:shadow-lg hover:scale-105 transition duration-500 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-[#34d399]  before:to-[#09f774]"
              >
                <span className="relative text-white font-bold px-4 py-8">
                  {" "}
                  {i.text}{" "}
                </span>

              </button>


            ))}
            <div>
              <Input
                placeholder="Custom"
                labelProps={{ className: "hidden" }}
                className="!border-2 font-bold text-center !bg-gradient-to-br from-[#34d399]  to-[#09f774] !border-[#34d399] !w-[108px] md:!w-[130px]  shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-white placeholder:opacity-100 focus:!border-[#34d399] focus:!border-t-[#34d399] focus:ring-gray-900/10   rounded-lg bg-gray-600/30 text-white"
                label="Custom Number"
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    loader(number);
                  }
                }}
              />
            </div>
          </div>

          <div
            className="flex justify-center mt-4 items-center"
            style={{ display: showloader }}
          >
            <div className="w-20 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
              <span className="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]"></span>
            </div>
          </div>


        </div>
        {address.length > 0 && address.map((e, i) => {
          if (e.walletAddress !== state?.mainWallet?.walletAddress) {
            return (
              <div className="flex mt-5 relative gap-4 flex-col justify-between w-full px-4 py-4 border-2 border-[#09f774]" key={i}>
                <div className="flex justify-between items-center">
                  <h1 className="flex flex-col md:flex-row justify-start items-start text-[8px] md:text-[18px]">
                    <span className="text-[#09f774]">Wallet address:</span>
                    {e.walletAddress}
                  </h1>
                  <button onClick={() => handleDelete(e._id)} className="text-red-500 hover:text-red-700 transition transform hover:scale-110 active:scale-95">
                    <DeleteOutlineIcon style={{ fontSize: 35, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }} />
                  </button>
                </div>

                <h1 className="flex flex-col md:flex-row justify-start items-start text-[12px] md:text-[18px]">
                  <span className="text-[#09f774]">Balance:</span>
                  {balances[e.walletAddress] !== undefined ? `${balances[e.walletAddress]} ETH` : "Loading..."}
                </h1>

                <h1 className="flex flex-col text-wrap md:flex-row justify-start items-start text-[6px] md:text-[18px]">
                  <span className="text-[#09f774]">Key:</span>
                  {e.privateKey}
                </h1>

                <h1 className="flex flex-col md:flex-row gap-2 text-[#09f774] text-[14px] md:text-[18px] md:items-center items-start justify-start w-full">
                  ETH Amount For Buy Token :
                  <span>
                    <Input
                      placeholder="Enter amount"
                      labelProps={{ className: "hidden" }}
                      className="!border-2 !border-[#34d399] !w-[200px] shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#34d399] focus:!border-t-[#34d399] focus:ring-gray-900/10 rounded-lg bg-gray-600/30 text-white"
                      label="ETH amount"
                      value={tokenAmounts[i] || ''}
                      onChange={(event) => handleTokenAmountChange(event, i)}
                    />
                  </span>
                </h1>
                <h1 className="flex flex-col md:flex-row gap-2 text-[#09f774] text-[14px] md:text-[18px] md:items-center items-start justify-start w-full">
                  Token Amount For Sell Token :
                  <span>
                    <Input
                      placeholder="Token amount"
                      labelProps={{ className: "hidden" }}
                      className="!border-2 !border-[#34d399] !w-[200px] shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#34d399] focus:!border-t-[#34d399] focus:ring-gray-900/10 rounded-lg bg-gray-600/30 text-white"
                      label="Token amount"
                      value={sellTokenAmounts[i] || ''}
                      onChange={(event) => handleSellTokenAmountChange(event, i)}
                    />
                  </span>
                </h1>
                <div className="justify-end flex-col md:flex-row flex gap-2">
                  <button onClick={() => transferTokenToAddress(e.privateKey,  state?.mainWallet?.walletAddress , sellTokenAmounts[i] , i)}
                    type="button"
                    className="bg-transparent border-2 border-[#34d399] text-center w-48 rounded-lg h-14 relative font-sans text-white text-xl font-semibold group"
                  >
                    <div
                      className="bg-[#34d399] rounded-lg h-11 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[170px] z-10 duration-500"
                    >
                      
                      <NearMeRoundedIcon className="text-[white]" />
                    </div>
                    <p className="translate-x-2">Transfer</p>
                  </button>
                  <button
                    onClick={() => { sellTokenTo(e.privateKey , sellTokenAmounts[i] , i) }}
                    type="button"
                    className="bg-transparent border-2 border-[#34d399] text-center w-48 rounded-lg h-14 relative font-sans text-white text-xl font-semibold group"
                  >
                    <div
                      className="bg-[#34d399] rounded-lg h-11 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[170px] z-10 duration-500"
                    >
                      <NearMeRoundedIcon className="text-[white]" />
                    </div>
                    <p className="translate-x-2">Sell</p>
                  </button>
                </div>
                {/* {showloader2 && (
                  <div className="flex justify-center mt-4 items-center">
                    <div className="w-20 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
                      <span className="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]"></span>
                    </div>
                  </div>
                )} */}

{loadingItemIndex === i && (
          <div className="flex justify-center mt-4 items-center">
            <div className="w-20 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
              <span className="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]"></span>
            </div>
          </div>
        )}
              </div>
            );
          }
          return null;
        })}


        {showTexHash && (
          <div className="bg-gray-700 p-4 rounded-lg mb-4 text-white flex justify-between items-center">
            <span>{texHash}</span>
            <button onClick={copyToClipboard} className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Copy
            </button>
          </div>
        )}



        <div
          className="flex justify-center mt-4 items-center"
          style={{ display: showloader1 }}
        >
          <div className="w-20 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
            <span className="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]"></span>
          </div>
        </div>



        <div className="relative mt-4">
          <button
            onClick={toggleDropdown} // Toggle dropdown on button click
            className="group/button relative w-full inline-flex items-center justify-center overflow-hidden rounded-md bg-grade backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-[#09f774]/30 border border-#09f774/20"
          >
            <span className="md:text-[18px] text-[14px]">{selectedOption}</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
              <div className="relative h-full w-10 bg-white/30"></div>
            </div>
          </button>

          {/* Dropdown Options */}
          {dropdownOpen && ( // Show dropdown only when dropdownOpen is true
            <div className="relative left-0 mt-2 w-full rounded-md shadow-lg bg-white z-10">
              <ul className="py-1">
                <li>
                  <button
                    onClick={
                      () => {
                        handleSelectOption(TRADING);
                        handleTrading()

                      }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Buy From All Sub Wallets
                  </button>
                </li>
                <li>
                  <button
                    onClick={
                      () => {
                        handleSelectOption(SELL);
                        handleSellTrading()

                      }


                    }
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Sell From Sub Wallets
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { handleSelectOption(TRANSFER); transTokenToMain() }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Tokens Transfer To Main Wallet
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { handleSelectOption(TRANSFER_ETH); transferETHEToMain() }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    ETHs Transfer To Main Wallet
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

    </div>

  );
};

export default Sniper;
