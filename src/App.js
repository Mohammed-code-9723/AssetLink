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
import SuperAdminHome from './layouts/SuperAdminHome';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import Permissions from './layouts/Permissions';
import AllUsers from './layouts/AllUsers';
import UpdateUser from './layouts/UpdateUser';
import ProtectedRoute from './components/ProtectedRoute';
import WorkspacesSuperAdmin from './layouts/WorkspacesSuperAdmin';
import Test from './layouts/Test';
import SystemSettings from './layouts/SystemSettings';

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

            <Route path="/tt" element={<Test/>} />
            
            <Route path="/dashboard" element={<Dashboard><Home /></Dashboard>} />
            {/* <Route path="/dashboard/Site" element={<Dashboard><Site /></Dashboard>} /> */}
            <Route path="/dashboard/Building" element={<Dashboard><Building /></Dashboard>} />
            <Route path="/dashboard/Component" element={<Dashboard><Component /></Dashboard>} />
            <Route path="/dashboard/Energy" element={<Dashboard><Energy /></Dashboard>} />
            
            <Route path="/dashboard/SuperAdmin" element={<ProtectedRoute><SuperAdminDashboard><SuperAdminHome /></SuperAdminDashboard></ProtectedRoute>} />
            <Route path="/dashboard/SuperAdmin/Permissions" element={<ProtectedRoute><SuperAdminDashboard><Permissions /></SuperAdminDashboard></ProtectedRoute>} />
            <Route path="/dashboard/SuperAdmin/Workspaces" element={<ProtectedRoute><SuperAdminDashboard><WorkspacesSuperAdmin/></SuperAdminDashboard></ProtectedRoute>} />
            <Route path="/dashboard/SuperAdmin/UpdateUser" element={<ProtectedRoute><SuperAdminDashboard><UpdateUser /></SuperAdminDashboard></ProtectedRoute>} />
            <Route path="/dashboard/SuperAdmin/AllUsers" element={<ProtectedRoute><SuperAdminDashboard><AllUsers /></SuperAdminDashboard></ProtectedRoute>} />
            <Route path="/dashboard/SuperAdmin/Settings" element={<ProtectedRoute><SuperAdminDashboard><SystemSettings /></SuperAdminDashboard></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
