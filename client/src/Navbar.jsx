import React, { useState, useContext } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import logo from "../src/assets/logo.jpg";
import { AppContext } from "./context/AppContext"; // Import AppContext
import { useLocation, useNavigate } from 'react-router-dom';

const NavBar = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const { state , setState , setAddress} = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    setAddress([])
    setState(null)
    navigate("/")
  };

  return (
    <nav className="flex bg-[#292929] px-8 md:px-16 py-4 justify-between items-center top-0 left-0 right-0 z-20">
      <div className="flex justify-center items-center gap-3"  onClick={() => navigate("/sniper")}>
        <img
          className="object-cover rounded-full max-w-12 max-h-12"
          src={logo}
          alt="Logo"
        />
        <h1 className="text-[#34d399] md:text-[26px] text-[18px]">Harley’s service</h1>
      </div>

      <button className="p-2 hidden" onClick={handleMenu}>
        <MenuRoundedIcon className="text-gray-600" />
      </button>
      <div
        id="nav-dialog"
        className={`fixed z-10 lg:hidden bg-[#09f774] inset-0 p-3 ${menuOpen ? "block" : "hidden"}`}
      >
        <div id="nav-bar" className="flex justify-between">
          <h1 className="text-lg font-medium font-display">ToDesktop</h1>
          <button className="p-2 lg:hidden" onClick={handleMenu}>
            <CloseRoundedIcon className="text-gray-600" />
          </button>
        </div>
        <div className="mt-6">
          {/* Conditionally render "Login" or "Logout" based on user state */}


        </div>
        <div className="h-[1px] bg-gray-300"></div>
        <button className="mt-6 w-full flex gap-2 items-center px-6 py-4 rounded-lg hover:bg-gray-50">
          Electron Developers
        </button>
      </div>
      <div className='flex'>
        {
          state?.role === 'admin' && location.pathname !== '/signup' && (
            <button
              className="text-[#34d399]  text-[20px] font-medium m-3 p-3 bg-transparent hover:text-white hover:bg-[#34d399] block rounded-lg transition duration-300 ease-in-out"
              onClick={() => navigate("/signup")} >
              Edit Users
            </button>
          )
        }
        {state ? (
          <button
            onClick={handleLogout}
            className="text-[#34d399] text-[18px] font-medium m-3 p-3 bg-transparent hover:text-white hover:bg-[#34d399] block rounded-lg transition duration-300 ease-in-out"
          >
            Logout
          </button>
        ) : ""}
      </div>

    </nav>
  );
};

export default NavBar;
