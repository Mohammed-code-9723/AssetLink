import React, { useState ,Suspense} from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Sidebar from './components/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';


import LoaderComponent from './layouts/LoaderComponent';
import Modal from '@mui/joy/Modal';


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
import ProtectedRoute from './components/ProtectedRoute';
import WorkspacesSuperAdmin from './layouts/WorkspacesSuperAdmin';
import Test from './layouts/Test';
import SystemSettings from './layouts/SystemSettings';
import SuperAdminAllSites from './layouts/SuperAdminAllSites';
import SuperAdminAllBuildings from './layouts/SuperAdminAllBuildings';
import SuperAdminAllComponents from './layouts/SuperAdminAllComponents';
import SuperAdminAllIncidents from './layouts/SuperAdminAllIncidents';
import SuperAdminAllReports from './layouts/SuperAdminAllReports';
import OtherRolesWorkspaces from './layouts/OtherRolesWorkspaces';
import AssignTasks from './layouts/AssignTasks';
import Analytics from './layouts/Analytics';
import OtherRolesSites from './layouts/OtherRolesSites';
import SiteBuildingsMap from './layouts/SiteBuildingsMap';
import OtherRolesBuildings from './layouts/OtherRolesBuildings';
import OtherRolesComponents from './layouts/OtherRolesComponents';
import Profile from './layouts/Profile';


//!
// const Profile=React.lazy(()=>import('./layouts/Profile'));
// const Dashboard = React.lazy(() => import('./components/Dashboard'));
// const Home = React.lazy(() => import('./layouts/Home'));
// // const Site = React.lazy(() => import('./layouts/Site'));
// // const Building = React.lazy(() => import('./layouts/Building'));
// // const ComponentLayout = React.lazy(() => import('./layouts/Component'));
// // const Energy = React.lazy(() => import('./layouts/Energy'));
// // const SiteBuildingsMap = React.lazy(() => import('./layouts/SiteBuildingsMap'));
// const LandingPage = React.lazy(() => import('./layouts/LandingPage'));
// const Pricing = React.lazy(() => import('./layouts/Pricing'));
// const AboutUs = React.lazy(() => import('./layouts/AboutUs'));
// const ContactUs = React.lazy(() => import('./layouts/ContactUs'));
// const HowItWorks = React.lazy(() => import('./layouts/HowItWorks'));
// const SuperAdminHome = React.lazy(() => import('./layouts/SuperAdminHome'));
// const SuperAdminDashboard = React.lazy(() => import('./components/SuperAdminDashboard'));
// const Permissions = React.lazy(() => import('./layouts/Permissions'));
// const AllUsers = React.lazy(() => import('./layouts/AllUsers'));
// const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));
// const WorkspacesSuperAdmin = React.lazy(() => import('./layouts/WorkspacesSuperAdmin'));
// const Test = React.lazy(() => import('./layouts/Test'));
// const SystemSettings = React.lazy(() => import('./layouts/SystemSettings'));
// const SuperAdminAllSites = React.lazy(() => import('./layouts/SuperAdminAllSites'));
// const SuperAdminAllBuildings = React.lazy(() => import('./layouts/SuperAdminAllBuildings'));
// const SuperAdminAllComponents = React.lazy(() => import('./layouts/SuperAdminAllComponents'));
// const SuperAdminAllIncidents = React.lazy(() => import('./layouts/SuperAdminAllIncidents'));
// const SuperAdminAllReports = React.lazy(() => import('./layouts/SuperAdminAllReports'));
// const OtherRolesWorkspaces = React.lazy(() => import('./layouts/OtherRolesWorkspaces'));
// const AssignTasks = React.lazy(() => import('./layouts/AssignTasks'));
// const Analytics = React.lazy(() => import('./layouts/Analytics'));
// const OtherRolesSites = React.lazy(() => import('./layouts/OtherRolesSites'));
// const OtherRolesBuildings = React.lazy(() => import('./layouts/OtherRolesBuildings'));
// const OtherRolesComponents = React.lazy(() => import('./layouts/OtherRolesComponents'));
//!
function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const location=useLocation();
  const user=localStorage.getItem('user');

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
          width:location.pathname==='/'?'100%':'100%',overflowX:'scroll'}}>
            <Suspense fallback={
            <LoaderComponent/>
            }>
              <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/Pricing" element={<Pricing/>} />
                <Route path="/AboutUs" element={<AboutUs/>} />
                <Route path="/ContactUs" element={<ContactUs/>} />
                <Route path="/HowItWorks" element={<HowItWorks/>} />

                <Route path="/tt" element={<Test/>} />
                
                <Route path="/dashboard" element={<Dashboard><Home /></Dashboard>} />
                {/* <Route path="/dashboard/Site" element={<Dashboard></Dashboard>} /> */}
                {/* <Route path="/dashboard/Building" element={<Dashboard><Building /></Dashboard>} />
                <Route path="/dashboard/Component" element={<Dashboard><Component /></Dashboard>} />
                <Route path="/dashboard/Energy" element={<Dashboard><Energy /></Dashboard>} /> */}
                
                <Route path="/dashboard/home/dashboard" element={<ProtectedRoute><SuperAdminDashboard><SuperAdminHome /></SuperAdminDashboard></ProtectedRoute>} />
                <Route path="/dashboard/SuperAdmin/Permissions" element={<ProtectedRoute><SuperAdminDashboard><Permissions /></SuperAdminDashboard></ProtectedRoute>} />
                <Route path="/dashboard/SuperAdmin/Workspaces" element={<ProtectedRoute><SuperAdminDashboard><WorkspacesSuperAdmin/></SuperAdminDashboard></ProtectedRoute>} />
                <Route path="/dashboard/SuperAdmin/Sites" element={<ProtectedRoute><SuperAdminDashboard><SuperAdminAllSites /></SuperAdminDashboard></ProtectedRoute>} />
                <Route path="/dashboard/SuperAdmin/Buildings" element={<ProtectedRoute><SuperAdminDashboard><SuperAdminAllBuildings /></SuperAdminDashboard></ProtectedRoute>} />
                <Route path="/dashboard/SuperAdmin/Components" element={<ProtectedRoute><SuperAdminDashboard><SuperAdminAllComponents /></SuperAdminDashboard></ProtectedRoute>} />
                <Route path="/dashboard/SuperAdmin/Incidents" element={<ProtectedRoute><SuperAdminDashboard><SuperAdminAllIncidents /></SuperAdminDashboard></ProtectedRoute>} />
                <Route path="/dashboard/SuperAdmin/Reports" element={<ProtectedRoute><SuperAdminDashboard><SuperAdminAllReports /></SuperAdminDashboard></ProtectedRoute>} />
                <Route path="/dashboard/SuperAdmin/AllUsers" element={<ProtectedRoute><SuperAdminDashboard><AllUsers /></SuperAdminDashboard></ProtectedRoute>} />
                <Route path="/dashboard/SuperAdmin/Settings" element={<ProtectedRoute><SuperAdminDashboard><SystemSettings /></SuperAdminDashboard></ProtectedRoute>} />
                <Route path="/dashboard/SuperAdmin/assignTasks" element={<ProtectedRoute><SuperAdminDashboard><AssignTasks /></SuperAdminDashboard></ProtectedRoute>} />
                <Route path="/dashboard/SuperAdmin/Analytics" element={<ProtectedRoute><SuperAdminDashboard><Analytics /></SuperAdminDashboard></ProtectedRoute>} />
                <Route path={`/dashboard/Workspaces`} element={<ProtectedRoute><Dashboard><OtherRolesWorkspaces /></Dashboard></ProtectedRoute>} />
                <Route path={`/dashboard/Sites`} element={<ProtectedRoute><Dashboard><OtherRolesSites /></Dashboard></ProtectedRoute>} />
                <Route path={`/dashboard/Buildings`} element={<ProtectedRoute><Dashboard><OtherRolesBuildings /></Dashboard></ProtectedRoute>} />
                <Route path={`/dashboard/Components`} element={<ProtectedRoute><Dashboard><OtherRolesComponents /></Dashboard></ProtectedRoute>} />
                <Route path={`/dashboard/Profile`} element={<ProtectedRoute><Dashboard><Profile /></Dashboard></ProtectedRoute>} />
              </Routes>
            </Suspense>
        </div>
      </div>
    </div>
  ); 
}

export default App;
