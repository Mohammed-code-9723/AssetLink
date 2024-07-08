import React from 'react';
import '../styles/Navbar.css';
import { Button } from '@mui/joy';
import { SiHomeassistant } from "react-icons/si";
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import { NavLink } from 'react-router-dom';
import { IoIosPricetags } from "react-icons/io";
import { RiHome3Fill } from "react-icons/ri";
import { FaCircleQuestion } from "react-icons/fa6";
import { HiInformationCircle } from "react-icons/hi2";
import { MdContactPhone } from "react-icons/md";
import { MdPersonAdd } from "react-icons/md";


export default function Navbar() {
    return (
        <div className='Nav_container'>
            <h1 className='logo'><SiHomeassistant style={{color:'white'}}/>&nbsp;&nbsp;&nbsp;<span style={{color:'white'}}>AssetLink</span></h1>
            <nav>
                <ul className='nav_links'>
                    <NavLink className='navbar_links' to='/dashboard'>
                        <RiHome3Fill/>&nbsp;&nbsp; Home
                    </NavLink>
                    <NavLink className='navbar_links' to='/howItsWorks'>
                        <FaCircleQuestion/>&nbsp;&nbsp; How It Works
                    </NavLink>
                    <NavLink className='navbar_links' to='/Pricing'>
                        <IoIosPricetags/>&nbsp;&nbsp; Pricing
                    </NavLink>
                    <NavLink className='navbar_links' to='/AboutUs'>
                        <HiInformationCircle/>&nbsp;&nbsp; About Us
                    </NavLink>
                    <NavLink className='navbar_links' to='/ContactUs'>
                        <MdContactPhone/>&nbsp;&nbsp; Contact Us
                    </NavLink>
                </ul>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '25%' }}>
                    <Button className="signInBtn" sx={{ borderRadius: '20px',background:'#088fa6' }}>
                        <MdPersonAdd/>&nbsp; &nbsp; &nbsp;  Sign In
                    </Button>
                </Box>
            </nav>
                    {/* <Avatar
                    variant="outlined"
                    size="sm"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                    /> */}
        </div>
    )
}
