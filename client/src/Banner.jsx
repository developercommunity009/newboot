

import { useState, useContext, useEffect } from "react";
import { Select, Option, Input } from "@material-tailwind/react";
import { AppContext } from "./context/AppContext";

const Banner = () => {
  const { deployContract , state} = useContext(AppContext);

  console.log("aaaaaa" , state.deployfun)
  const [showloader, setLoader] = useState("none");

  const [showData, setShowData] = useState(false);
  const [texHash, setTexHash] = useState('');
  const [address, setAddress] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    rawSupply: '',
    taxwallet : '',
    teamWallet:'',
    website: '',
    twitter: '',
    github: '',
    discord: '',
    deployKey:'',
    tFee:'',
    mFee: '',
    bFee:'',
    uFee:'',
    liqFee:''

  });
console.log(formData)
  useEffect(() => {
    let timer;
    if (showData) {
      timer = setTimeout(() => {
        setShowData(false);
      }, 60000); // 60000 milliseconds = 1 minute
    }
    return () => clearTimeout(timer);
  }, [showData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(formData);
      setLoader('flex')
      const result = await deployContract(formData);
      setLoader('none')
      console.log('transactionHash is :', result.transactionHash);
      setTexHash(result.transactionHash);
      console.log('contractAddress is :', result.contractAddress);
      setAddress(result.contractAddress);
      setShowData(true);
      setFormData("");
    } catch (error) {
      setLoader('none')

      console.error('Error submitting form:', error);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    console.log(`${text} copied to clipboard!`);
  };

  return (
    <div className="px-8 flex flex-col py-8 justify-center items-center">
      <h1 className="gradient-bg text-[38px] md:text-[72px] font-bold">Deploy Token</h1>
      <form
        className="bg-[#292929] shadow-bg md:w-[670px] w-full border-b-[6px] border-b-[#34d399] border-t-[6px] rounded-xl border-t-[#34d399] p-4"
        onSubmit={handleSubmit}
      >
        <div className="flex-col flex w-full justify-start gap-2 items-start ">
          <h1 className="text-white text-[14px] md:text-[18px]">Network</h1>
          <Select
            label="select Network"
            className="p-3 rounded-lg bg-gray-600/30 text-white"
            color="teal"
          >
            {/* <Option>BNB</Option> */}
            <Option>Ethereum Mainnet</Option>
          </Select>
         
        </div>
        <div className="mt-5 flex-col flex w-full justify-start gap-2 items-start">
        <h1 className="text-white text-[14px] md:text-[18px]">Private key</h1>
          <Input
            name="deployKey"
          value={formData.deployKey}
        placeholder="private Key"
        onChange={handleChange}
        labelProps={{ className: "hidden" }}
        className="!border !border-gray-300 bg-[#09f774] shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg bg-gray-600/30 text-white"
        label="D_privateKey"
        
        
      />
      </div>
        <div className="flex md:flex-row justify-between flex-col mt-5">
          <div className="flex-col w-full md:w-[205px] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Token Name</h1>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              color="teal"
              className="rounded-lg bg-gray-600/30 text-white"
              label="Token Name"
            />
          </div>
          <div className="flex-col w-full md:w-[205px] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Symbol</h1>
            <Input
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              color="teal"
              className="rounded-lg bg-gray-600/30 text-white"
              label="Token symbol"
            />
          </div>
          <div className="flex-col w-full md:w-[205px] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Token supply</h1>
            <Input
              name="rawSupply"
              value={formData.rawSupply}
              onChange={handleChange}
              color="teal"
              className="rounded-lg bg-gray-600/30 text-white"
              label="min 1000"
            />
          </div>
        </div>
        <div className="flex-col w-full flex mt-5 justify-start gap-2 items-start ">
          <h1 className="text-white text-[14px] md:text-[18px]">Marketing Wallet</h1>
          <Input
          name="taxwallet"
          value={formData.taxwallet}
          onChange={handleChange}
            placeholder="0x.."
            labelProps={{ className: "hidden" }}
            className="!border !border-gray-300 bg-[#09f774] shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg bg-gray-600/30 text-white"
            label="Token Name"
          />
        </div>

        <div className="flex-col w-full flex mt-5 justify-start gap-2 items-start ">
          <h1 className="text-white text-[14px] md:text-[18px]">Team Wallet</h1>
          <Input
          name="teamWallet"
          value={formData.teamWallet}
          onChange={handleChange}
            placeholder="0x.."
            labelProps={{ className: "hidden" }}
            className="!border !border-gray-300 bg-[#09f774] shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg bg-gray-600/30 text-white"
            label="Token Name"
          />
        </div>
        <div className="flex md:flex-row justify-between flex-col mt-5">
          <div className="flex-col w-full md:w-[205px] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Marketing Fee</h1>
            <Input
              name="mFee"
              value={formData.mFee}
              onChange={handleChange}
              labelProps={{ className: "hidden" }}
              className="!border p-[7px] !border-gray-300 bg-transparent shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg text-white"
            />
          </div>
          <div className="flex-col w-full md:w-[205px] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]"> Team Fee</h1>
            <Input
              name="tFee"
              value={formData.tFee}
              onChange={handleChange}
              labelProps={{ className: "hidden" }}
              className="!border p-[7px] !border-gray-300 bg-transparent shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg text-white"
             
            />
          </div>
          <div className="flex-col w-full md:w-[205px] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Liquidity Fee</h1>
            <Input
              name="liqFee"
              value={formData.liqFee}
              onChange={handleChange}
              labelProps={{ className: "hidden" }}

              className="!border w-full md:w-auto p-[7px] !border-gray-300 bg-transparent shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="flex md:flex-row justify-between flex-col mt-5">
          <div className="flex-col w-full md:w-[49%] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Utility Fee</h1>
            <Input
              name="uFee"
              value={formData.uFee}
              onChange={handleChange}
              color="teal"
              labelProps={{ className: "hidden" }}
              className="!border p-[7px] !border-gray-300 bg-transparent shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg text-white"
           
            />
          </div>
          <div className="flex-col w-full md:w-[49%] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Burn Fee</h1>
            <Input
             name="bFee"
             value={formData.bFee}
             onChange={handleChange}
              color="teal"
              labelProps={{ className: "hidden" }}
              className="!border p-[7px] !border-gray-300 bg-transparent shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg text-white"
              
            />
          </div>
        </div>
        <div className="flex md:flex-row justify-between flex-col mt-5">
          <div className="flex-col w-full md:w-[49%] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Website</h1>
            <Input
              name="website"
              value={formData.website}
              onChange={handleChange}
              color="teal"
              labelProps={{ className: "hidden" }}
              className="!border p-[7px] !border-gray-300 bg-transparent shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg text-white"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div className="flex-col w-full md:w-[49%] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Twitter</h1>
            <Input
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              color="teal"
              labelProps={{ className: "hidden" }}
              className="!border p-[7px] !border-gray-300 bg-transparent shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg text-white"
              placeholder="@yourtwitter"
            />
          </div>
        </div>

        <div className="flex md:flex-row justify-between flex-col mt-5">
          <div className="flex-col w-full md:w-[49%] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Telegram</h1>
            <Input
              name="github"
              value={formData.github}
              onChange={handleChange}
              color="teal"
              labelProps={{ className: "hidden" }}
              className="!border p-[7px] !border-gray-300 bg-transparent shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg text-white"
              placeholder="User link"
            />
          </div>
          <div className="flex-col w-full md:w-[49%] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Discord</h1>
            <Input
              name="discord"
              value={formData.discord}
              onChange={handleChange}
              color="teal"
              labelProps={{ className: "hidden" }}
              className="!border p-[7px] !border-gray-300 bg-transparent shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg text-white"
              placeholder="https://discord.gg/yourdiscord"
            />
          </div>
        </div>

        {/* <div className="flex md:flex-row justify-between flex-col mt-5">
          <div className="flex-col w-full md:w-[49%] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Buy Burn Tax</h1>
            <Input
              color="teal"
              labelProps={{ className: "hidden" }}
              className="!border p-[7px] !border-gray-300 bg-transparent shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg text-white"
              placeholder="0 - 15%"
            />
          </div>
          <div className="flex-col w-full md:w-[49%] flex justify-start gap-2 items-start ">
            <h1 className="text-white text-[14px] md:text-[18px]">Sell Burn Tax</h1>
            <Input
              color="teal"
              labelProps={{ className: "hidden" }}
              className="!border p-[7px] !border-gray-300 bg-transparent shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg text-white"
              placeholder="0 - 15%"
            />
          </div>
        </div>

        <div className="flex-col w-full flex mt-5 justify-start gap-2 items-start ">
          <h1 className="text-white text-[14px] md:text-[18px]">Treasury Wallet</h1>
          <Input
            placeholder="0x.."
            labelProps={{ className: "hidden" }}
            className="!border !border-gray-300 bg-[#09f774] shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#009688] focus:!border-t-[#009688] focus:ring-gray-900/10 rounded-lg bg-gray-600/30 text-white"
            label="Token Name"
          />
        </div> */}

        <div
            className="flex justify-center mt-4 items-center"
            style={{ display: showloader }}
          >
            <div className="w-20 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
              <span className="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]"></span>
            </div>
          </div>


          <button
  className={`group/button relative w-[95%] left-[2%] mt-5 inline-flex items-center justify-center overflow-hidden rounded-md px-6 py-2 text-base font-semibold transition-all duration-500 ease-in-out border ${
    state.deployfun ?  'bg-gray-400 text-gray-200 cursor-not-allowed border-gray-300'
    :'bg-grade text-white hover:scale-105 hover:shadow-xl hover:shadow-[#09f774]/30 border-[#09f774]/20'
     
  }`}
  type="submit"
  disabled={state.deployfun} // Disable the button if deployfun is false
>
  <span className="text-lg">{state.deployfun  ? " Already Deployed" :"Deploy"}</span>
  {state.deployfun && (
    <div
      className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
    >
      <div className="relative h-full w-10 bg-[white]/30"></div>
    </div>
  )}
</button>

        {/* <button
          className="group/button relative w-[95%] left-[2%] mt-5 inline-flex items-center justify-center overflow-hidden rounded-md bg-grade backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-[#09f774]/30 border border-[#09f774]/20"
          type="submit"
        >
          <span className="text-lg">Deploy</span>
          <div
            className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
          >
            <div className="relative h-full w-10 bg-[white]/30"></div>
          </div>
        </button> */}


      </form>
      {showData && (
        <div className="mt-5 text-center">
          
          <div className="bg-gray-800 p-4 rounded-lg mt-2">
            <p className="text-white mb-2">Contract Address: {address}</p>
            <button
              onClick={() => handleCopy(address)}
              className="bg-green-500 text-white px-2 py-1 rounded-md"
            >
              Copy Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;


