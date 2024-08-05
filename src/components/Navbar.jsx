import React,{useState} from 'react';
import '../styles/Navbar.css';
import { Button } from '@mui/joy';
import { SiHomeassistant } from "react-icons/si";
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import { NavLink ,useLocation, useNavigate} from 'react-router-dom';
import { IoIosPricetags } from "react-icons/io";
import { RiHome3Fill } from "react-icons/ri";
import { FaCircleQuestion } from "react-icons/fa6";
import { HiInformationCircle } from "react-icons/hi2";
import { MdContactPhone } from "react-icons/md";
import { MdPersonAdd } from "react-icons/md";


import { MdAutoAwesome } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Form,Input, SelectPicker } from 'rsuite';
import { MdCancel } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";

const selectData = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice'].map(item => ({
    label: item,
    value: item
}));

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
export default function Navbar() {
    const navigate=useNavigate();
    const location = useLocation();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);

    const [formValue, setFormValue] = React.useState({
        name: '',
        email: '',
        password: '',
        textarea: ''
    });
    const [navOpen,setNavOpen]=useState(false);
    const toggleNavBar=()=>{
        setNavOpen(!navOpen);
    }

    const logOut=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    }

    return (
        <div className='Nav_container' style={{height:navOpen?'330px':'35px'}}>
            <h1 className='logo'><SiHomeassistant style={{color:'white'}}/>&nbsp;&nbsp;&nbsp;<span style={{color:'white'}}>AssetLink</span></h1>
            {location.pathname.startsWith('/dashboard') ? (
                // Conditionally render Avatar if URL is /dashboard/*
                <>
                    <Avatar src="https://i.pravatar.cc/150?u=2" circle />
                    <Button
                        id='toggleButton'
                        onClick={toggleNavBar}
                    >
                        <GiHamburgerMenu size={25} />
                    </Button>
                    <Button
                        onClick={logOut}
                    >
                        log out
                    </Button>
                </>
            ) : (
                // Render navigation menu otherwise
                <nav>
                    <ul className='nav_links'>
                        <NavLink className='navbar_links' to='/'>
                            <RiHome3Fill size={25} className='nav_icons' />&nbsp;&nbsp; <span className='nav_spans'>Home</span>
                        </NavLink>
                        <NavLink className='navbar_links' to='/HowItWorks'>
                            <FaCircleQuestion size={25} className='nav_icons' />&nbsp;&nbsp; <span className='nav_spans'>How It Works</span>
                        </NavLink>
                        <NavLink className='navbar_links' to='/Pricing'>
                            <IoIosPricetags size={25} className='nav_icons' />&nbsp;&nbsp; <span className='nav_spans'>Pricing</span>
                        </NavLink>
                        <NavLink className='navbar_links' to='/AboutUs'>
                            <HiInformationCircle size={25} className='nav_icons' />&nbsp;&nbsp; <span className='nav_spans'>About Us</span>
                        </NavLink>
                        <NavLink className='navbar_links' to='/ContactUs'>
                            <MdContactPhone size={25} className='nav_icons' />&nbsp;&nbsp; <span className='nav_spans'>Contact Us</span>
                        </NavLink>
                    </ul>
                    <Box id="signUpButton" sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '25%' }}>
                        <Button onClick={handleOpen} className="signInBtn" sx={{ borderRadius: '20px', background: '#088fa6' }}>
                            <MdPersonAdd />&nbsp; &nbsp; &nbsp;  Sign In
                        </Button>
                    </Box>
                    <Button
                        id='toggleButton'
                        onClick={toggleNavBar}
                    >
                        <GiHamburgerMenu size={25} />
                    </Button>
                </nav>
            )}
                {/* Modal sign up */}                
                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={open}
                    onClose={() => setOpen(false)}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Sheet
                    variant="outlined"
                    sx={{
                        width:'70%',
                        borderRadius: 'md',
                        boxShadow: 'lg',
                        display:'flex',
                        height:'90vh',
                    }}
                    id="sheet"
                    >
                        <ModalClose variant="plain" sx={{ m: 1 }} />
                        <div className='image_wavy' style={{width:'40%'}}>
                            <img src="/wallpaper_1.jpg" alt="logImg" style={{
                                width:'100%',
                                position:'relative ',
                                borderTopLeftRadius:'7px',
                                borderBottomLeftRadius:'7px',
                                height:'90vh'
                            }}/>
                        </div>
                        <div className='form_model' style={{
                            width:'60%',
                            padding:'50px 20px '
                        }}>
                            <center>
                                <h1 style={{marginTop:'-50px'}}>Sign up </h1>
                            </center>
                            <Form fluid onChange={setFormValue} formValue={formValue}>
                                <Form.Group controlId="name-9">
                                <Form.ControlLabel>Username</Form.ControlLabel>
                                <Form.Control name="name" />
                                <Form.HelpText>Required</Form.HelpText>
                                </Form.Group>
                                <Form.Group controlId="email-9">
                                <Form.ControlLabel>Email</Form.ControlLabel>
                                <Form.Control name="email" type="email" />
                                <Form.HelpText>Required</Form.HelpText>
                                </Form.Group>
                                <Form.Group controlId="password-9">
                                <Form.ControlLabel>Password</Form.ControlLabel>
                                <Form.Control name="password" type="password" autoComplete="off" />
                                </Form.Group>
                                <Form.Group controlId="select-10">
                                <Form.ControlLabel>Country</Form.ControlLabel>
                                <SelectPicker data={selectData} style={{ width: '100%',zIndex:100,marginBottom:'10px' }} placement="rightStart" />
                                </Form.Group>
                            </Form>
                            <div style={{
                                width:'100%',
                                display:'flex',
                                justifyContent:'space-evenly',
                                marginTop:'100px'
                            }}>
                            <Button 
                            sx={{
                                borderRadius:'20px',
                                width:'200px',
                                background:' linear-gradient(124deg, rgba(12,46,96,1) 0%, rgba(38,86,17,1) 46%, rgba(9,46,100,1) 100%)'
                            }}
                            onClick={() => setOpen(false)} appearance="primary">
                                <FiLogIn />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Login
                            </Button>
                            <Button 
                            sx={{
                                borderRadius:'20px',
                                width:'200px',
                                background:' linear-gradient(124deg, rgba(12,46,96,1) 0%, rgba(38,86,17,1) 46%, rgba(9,46,100,1) 100%)'
                            }}
                            onClick={() => setOpen(false)} appearance="subtle">
                                <MdCancel/>&nbsp;&nbsp;&nbsp;&nbsp;Cancel
                            </Button>
                            </div>
                        </div>
                    </Sheet>
                </Modal>
        </div>
    )
}
