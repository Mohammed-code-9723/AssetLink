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


import { MdAutoAwesome } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";

import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Form,Input, SelectPicker } from 'rsuite';

const selectData = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice'].map(item => ({
    label: item,
    value: item
}));

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
export default function Navbar() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);

    const [formValue, setFormValue] = React.useState({
        name: '',
        email: '',
        password: '',
        textarea: ''
    });

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
                    <Button onClick={handleOpen} className="signInBtn" sx={{ borderRadius: '20px',background:'#088fa6' }}>
                        <MdPersonAdd/>&nbsp; &nbsp; &nbsp;  Sign In
                    </Button>
                </Box>
            </nav>
            <div >
                //! Modal:
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
                    >
                        <ModalClose variant="plain" sx={{ m: 1 }} />
                        <div style={{width:'40%'}}>
                            <img src="/wallpaper_1.jpg" alt="logImg" style={{
                                width:'100%',
                                position:'relative ',
                                borderTopLeftRadius:'7px',
                                borderBottomLeftRadius:'7px',
                                height:'90vh'
                            }}/>
                        </div>
                        <div style={{
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
                                <Form.Group controlId="textarea-9">
                                <Form.ControlLabel>Textarea</Form.ControlLabel>
                                <Form.Control rows={5} name="textarea" accepter={Textarea} />
                                </Form.Group>
                                <Form.Group controlId="select-10">
                                <Form.ControlLabel>SelectPicker</Form.ControlLabel>
                                <SelectPicker data={selectData} style={{ width: '100%',zIndex:100,marginBottom:'10px' }} placement="rightStart" />
                                </Form.Group>
                            </Form>
                            <div style={{
                                width:'100%',
                                display:'flex',
                                justifyContent:'space-evenly',
                                // marginTop:'100px'
                            }}>
                            <Button onClick={() => setOpen(false)} appearance="primary">
                                <FiLogIn />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Login
                            </Button>
                            <Button onClick={() => setOpen(false)} appearance="subtle">
                                Cancel
                            </Button>
                            </div>
                        </div>
                    </Sheet>
                </Modal>
            </div>
        </div>
    )
}
