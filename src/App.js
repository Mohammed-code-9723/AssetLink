import React, { useState } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Sidebar from './components/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Home from './layouts/Home';
import Site from './layouts/Site';
import Building from './layouts/Building';
import Component from './layouts/Component';
import Energy from './layouts/Energy';
import LandingPage from './layouts/LandingPage';
import Pricing from './layouts/Pricing';
import AboutUs from './layouts/AboutUs';
import ContactUs from './layouts/ContactUs';
import HowItWorks from './layouts/HowItWorks';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const location=useLocation();

  return (
    <div className={`App ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <Navbar />
      <div className='body_container'>
        {
          (location.pathname !== '/'  && location.pathname !=='/Pricing' && location.pathname !=='/AboutUs' && location.pathname !=='/ContactUs' && location.pathname !=='/HowItWorks')&& (
            <>
              <div className='sidebar_container'>
                <Sidebar onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)} />
              </div>
            </>
          )
        }
        <div className='routes_container' style={{
          marginLeft:location.pathname==='/'|| location.pathname === '/Pricing'|| location.pathname === '/AboutUs'|| location.pathname === '/ContactUs'|| location.pathname === '/HowItWorks'?0:'',
          width:location.pathname==='/'?'100%':'100%'}}>
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/Pricing" element={<Pricing/>} />
            <Route path="/AboutUs" element={<AboutUs/>} />
            <Route path="/ContactUs" element={<ContactUs/>} />
            <Route path="/HowItWorks" element={<HowItWorks/>} />
            
            <Route path="/dashboard" element={<Dashboard><Home /></Dashboard>} />
            <Route path="/dashboard/Site" element={<Dashboard><Site /></Dashboard>} />
            <Route path="/dashboard/Building" element={<Dashboard><Building /></Dashboard>} />
            <Route path="/dashboard/Component" element={<Dashboard><Component /></Dashboard>} />
            <Route path="/dashboard/Energy" element={<Dashboard><Energy /></Dashboard>} />
            {/* <Route path="/dashboard/Pricing" element={<Dashboard><Pricing /></Dashboard>} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
