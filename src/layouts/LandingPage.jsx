import React,{useState} from 'react'
import { Button } from '@mui/joy';
import { MdAutoAwesome } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";

import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
// import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Form } from 'rsuite';

//!Pricing: 
import Box from '@mui/joy/Box';
// import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';
import Check from '@mui/icons-material/Check';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
//
import '../styles/LandingPage.css';

export default function LandingPage() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const HandleSubmit = async (e) => {
        e.preventDefault();
        
        if (email === '') {
            alert('Email is empty');
            return;
        } else if (password === '') {
            alert('Password is empty');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Login successful');
                console.log(data.user);
                console.log(data.token);
                setOpen(false);
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            alert('An error occurred: ' + error.message);
        }
    };

    return (
        <>
            <div className='landing_container'>
                <div className='hero_section'>
                    Gestion immobilière <br />
                    sans effort avec <br />
                    AssetLink <br />
                    à l'aide d'AI <MdAutoAwesome size={50}/><br />
                    <Button 
                    // className="signInBtn"
                    onClick={handleOpen}
                    sx={{
                        width:'50%',
                        borderRadius: '20px',
                        background:'#088fa6' 
                    }}>
                        <FiLogIn />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Log in
                    </Button>
                </div>
                <div className='image_section'>
                    <img src="/realEstate.png" alt="realEstate" id='imgHouse'/>
                </div>
            </div>
            
            <div >
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
                        </div>
                        <div className='form_model' style={{
                            width:'60%',
                            padding:'100px 20px '
                            // display:'flex', 
                            // flexDirection:'column',
                            // justifyContent:'center',
                            // alignItems:'center'
                        }}>
                            <center>
                                <h1 style={{marginTop:'-50px'}}>Log in </h1>
                            </center>
                            <Form fluid>
                                <Form.Group controlId="email-1">
                                <Form.ControlLabel>Email</Form.ControlLabel>
                                <Form.Control name="email" type="email" value={email}  onChange={(value)=>setEmail(value)}/>
                                <Form.HelpText>Required</Form.HelpText>
                                </Form.Group>
                                <Form.Group controlId="password-1">
                                <Form.ControlLabel>Password</Form.ControlLabel>
                                <Form.Control name="password" type="password" value={password}  autoComplete="off" onChange={(value)=>setPassword(value)}/>
                                <Form.HelpText>Required</Form.HelpText>
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
                            onClick={HandleSubmit} appearance="primary">
                                <FiLogIn />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Login
                            </Button>
                            <Button 
                            sx={{
                                borderRadius:'20px',
                                width:'200px',
                                background:' linear-gradient(124deg, rgba(12,46,96,1) 0%, rgba(38,86,17,1) 46%, rgba(9,46,100,1) 100%)'
                            }}
                            onClick={() => setOpen(false)} appearance="subtle">
                                Cancel
                            </Button>
                            </div>
                        </div>
                    </Sheet>
                </Modal>
            </div>
            
        </>
    )
}
