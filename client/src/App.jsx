
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './Navbar';
import Banner from './Banner';
import Sniper from './Sniper';
import Login from './Login';
import Signup from './Singup'; // Uncomment if you have a Signup component
import ProtectedRoute from './ProtectedRoute';
import SecureRoute from './SecureRoute';


function App() {
  return (
    <div className="bg-[#1a1919] min-h-screen overflow-hidden">
      <NavBar />
      <Routes>
        <Route 
          path="/sniper" 
          element={
            <ProtectedRoute
            element={
              <div>
                {/* <Banner /> */}
                <Sniper />
              </div>
            }
          />
          } 
        />
        <Route path="/" element={<Login />} />
        <Route 
          path="/signup" 
          element={<SecureRoute element={<Signup />} />} 
        />
      </Routes>
    </div>
  );
}

export default App;

