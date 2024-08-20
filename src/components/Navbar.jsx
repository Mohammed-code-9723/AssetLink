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

//! translation:
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'rsuite';

import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useDispatch } from 'react-redux';
import { login } from '../features/UserSlice';
import { RiLogoutCircleRLine } from "react-icons/ri";

import {IconButton, Menu, MenuItem } from '@mui/material';
export default function Navbar() {
    const navigate=useNavigate();
    const location = useLocation();
    const token=localStorage.getItem('token');

    const {t,i18n } = useTranslation();
    const [codeF, setCodeF] = React.useState('gb');
    
    const dispatch = useDispatch();
    
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [errorEmail,setErrorEmail]=useState({error:false});
    const [errorPassword,setErrorPassword]=useState({error:false});

    const [navOpen,setNavOpen]=useState(false);
    const toggleNavBar=()=>{
        setNavOpen(!navOpen);
    }

    const logOut=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    }

    const handleLanguageChange = (lng,language) => {
        i18n.changeLanguage(lng);
        setCodeF(language);
    };

    
const handleSubmit = async (e) => {
        e.preventDefault();

        if (email === '') {
            setErrorEmail({ error: true });
            return;
        } else if (password === '') {
            setErrorPassword({ error: true });
            return;
        }

        try {
            const result = await dispatch(login({ email, password })).unwrap();
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('token', result.token);
            console.log(result.user);
            console.log(result.token);
            setOpen(false);
            navigate('/dashboard/SuperAdmin');
        } catch (error) {
            alert(error.message || 'Login failed');
        }
    };

    const handleClose=()=>{
        setOpen(false);
        setEmail('')
        setPassword('')
        setErrorEmail({error:false});
        setErrorPassword({error:false});

    }

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose2 = () => {
        setAnchorEl(null);
    };

    return (
        <div className='Nav_container' style={{height:navOpen?'330px':'35px'}}>
            <h1 className='logo'><SiHomeassistant style={{color:'white'}}/>&nbsp;&nbsp;&nbsp;<span style={{color:'white'}}>AssetLink</span></h1>
            {token ? (
                
                <>
                    <Button
                        id='toggleButton'
                        onClick={toggleNavBar}
                    >
                        <GiHamburgerMenu size={25} />
                    </Button>
                    <div className='navButtons_div'>
                        <IconButton onClick={handleClick}>
                            <Avatar src="https://i.pravatar.cc/150?u=2" />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl&&anchorEl}
                            open={Boolean(anchorEl&&anchorEl)}
                            onClose={handleClose2}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={logOut} ><RiLogoutCircleRLine/>&nbsp;&nbsp; Log Out</MenuItem>
                        </Menu>
                        <Select
                            className='SelectLanguage'
                            defaultValue={codeF}
                            startDecorator={<span className={`fi fi-${codeF}`}></span>}
                            slotProps={{
                                listbox: {
                                    sx: {
                                        '--ListItemDecorator-size': '44px',
                                    },
                                },
                            }}
                            sx={{
                                '--ListItemDecorator-size': '33px',
                                borderRadius:'20px',
                                width:'200px',
                                background:'#088fa6',
                            border:'1px solid rgb(21, 255, 169)',
                            color:'white',
                            '&:hover':{
                                boxShadow:'0 0 10px rgb(21, 255, 169)',
                                transition:'0.3s',
                                background:'#088fa6',
                            }
                                // height:'30x'
                            }}
                            
                            >
                            <Option value={'gb'} onClick={() => handleLanguageChange('en','gb')}>
                                <ListItemDecorator>
                                    <span className="fi fi-gb"></span>
                                </ListItemDecorator>
                                &nbsp;&nbsp;English
                            </Option>
                            <Option value={'fr'} onClick={() => handleLanguageChange('fr','fr')}>
                                <ListItemDecorator>
                                    <span className="fi fi-fr"></span>
                                </ListItemDecorator>
                                &nbsp;&nbsp;Français
                            </Option>
                            <Option value={'sa'} onClick={() => handleLanguageChange('ar','sa')}>
                                <ListItemDecorator>
                                    <span className="fi fi-sa"></span>
                                </ListItemDecorator>
                                &nbsp;&nbsp;العربية
                            </Option>
                        </Select>
                    </div>
                </>
            ) : (
                <nav>
                    <ul className='nav_links'>
                        <NavLink className='navbar_links' to='/'>
                            <RiHome3Fill size={25} className='nav_icons' />&nbsp;&nbsp; <span className='nav_spans'>{t('home')}</span>
                        </NavLink>
                        <NavLink className='navbar_links' to='/HowItWorks'>
                            <FaCircleQuestion size={25} className='nav_icons' />&nbsp;&nbsp; <span className='nav_spans'>{t('work')}</span>
                        </NavLink>
                        <NavLink className='navbar_links' to='/Pricing'>
                            <IoIosPricetags size={25} className='nav_icons' />&nbsp;&nbsp; <span className='nav_spans'>{t('pricing')}</span>
                        </NavLink>
                        <NavLink className='navbar_links' to='/AboutUs'>
                            <HiInformationCircle size={25} className='nav_icons' />&nbsp;&nbsp; <span className='nav_spans'>{t('about')}</span>
                        </NavLink>
                        <NavLink className='navbar_links' to='/ContactUs'>
                            <MdContactPhone size={25} className='nav_icons' />&nbsp;&nbsp; <span className='nav_spans'>{t('contact')}</span>
                        </NavLink>
                    </ul>
                    <Box id="signUpButton" sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '25%' }}>
                        <Button 
                        // className="signInBtn"
                        onClick={handleOpen}
                        sx={{
                            width:'fit-content',
                            borderRadius: '20px',
                            background:'#088fa6',
                            border:'1px solid rgb(21, 255, 169)',
                            '&:hover':{
                                boxShadow:'0 0 10px rgb(21, 255, 169)',
                                transition:'0.3s',
                                background:'#088fa6',

                            }
                        }}>
                            <FiLogIn />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{t('login')}
                        </Button>
                    </Box>
                    <Button
                        id='toggleButton'
                        onClick={toggleNavBar}
                    >
                        <GiHamburgerMenu size={25} />
                    </Button>
                    <Select
                        className='SelectLanguage'
                        defaultValue={codeF}
                        startDecorator={<span className={`fi fi-${codeF}`}></span>}
                        slotProps={{
                            listbox: {
                                sx: {
                                    '--ListItemDecorator-size': '44px',
                                },
                            },
                        }}
                        sx={{
                            '--ListItemDecorator-size': '33px',
                            borderRadius:'20px',
                            width:'200px',
                            background:'#088fa6',
                            border:'1px solid rgb(21, 255, 169)',
                            color:'white',
                            '&:hover':{
                                boxShadow:'0 0 10px rgb(21, 255, 169)',
                                transition:'0.3s',
                                background:'#088fa6',
                            }
                            // height:'30x'
                        }}
                        
                        >
                        <Option value={'gb'} onClick={() => handleLanguageChange('en','gb')}>
                            <ListItemDecorator>
                                <span className="fi fi-gb"></span>
                            </ListItemDecorator>
                            &nbsp;&nbsp;English
                        </Option>
                        <Option value={'fr'} onClick={() => handleLanguageChange('fr','fr')}>
                            <ListItemDecorator>
                                <span className="fi fi-fr"></span>
                            </ListItemDecorator>
                            &nbsp;&nbsp;Français
                        </Option>
                        <Option value={'sa'} onClick={() => handleLanguageChange('ar','sa')}>
                            <ListItemDecorator>
                                <span className="fi fi-sa"></span>
                            </ListItemDecorator>
                            &nbsp;&nbsp;العربية
                        </Option>
                    </Select>
                </nav>
            )}
            <div >
                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={open}
                    onClose={handleClose}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Sheet
                    variant="outlined"
                    sx={{
                        width:'70%',
                        borderRadius: 'md',
                        // p: 3,
                        boxShadow: 'lg',
                        display:'flex',
                        height:'70vh'
                        // justifyContent:'space'
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
                                height:'70vh'
                            }}/>
                            <img src="/assets/login.svg" alt="svgLogin" style={{
                                width:'350px',
                                position:'absolute ',
                                top:'10%',
                                left:'30px',
                                height:'350px'
                            }}/>
                        </div>
                        <div className='form_model' style={{
                            width:'60%',
                            padding:'100px 20px '
                        }}>
                            <center>
                                <h1 style={{marginTop:'-50px'}}>{t('login')}</h1>
                            </center>
                            <Form fluid>
                                <Form.Group controlId="email-1">
                                <Form.ControlLabel>{t('email')}</Form.ControlLabel>
                                <Form.Control name="email" type="email" value={email}  onChange={(value)=>setEmail(value)}/>
                                <Form.HelpText>
                                    <Form.HelpText>{errorEmail.error?(<span style={{color:'red'}}><strong>Error!</strong> Email is required</span>):<span>Required</span>}</Form.HelpText>
                                </Form.HelpText>
                                </Form.Group>
                                <Form.Group controlId="password-1">
                                <Form.ControlLabel>{t('password')}</Form.ControlLabel>
                                <Form.Control name="password" type="password" value={password}  autoComplete="off" onChange={(value)=>setPassword(value)}/>
                                <Form.HelpText>{errorPassword.error?(<span style={{color:'red'}}><strong>Error!</strong> Password is required</span>):<span>Required</span>}</Form.HelpText>
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
                            onClick={handleSubmit} appearance="primary">
                                <FiLogIn />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {t('login')}
                            </Button>
                            <Button 
                            sx={{
                                borderRadius:'20px',
                                width:'200px',
                                background:' linear-gradient(124deg, rgba(12,46,96,1) 0%, rgba(38,86,17,1) 46%, rgba(9,46,100,1) 100%)'
                            }}
                            onClick={() => setOpen(false)} appearance="subtle">
                                {t('cancel')}
                            </Button>
                            </div>
                        </div>
                    </Sheet>
                </Modal>
            </div>
        </div>
    )
}
