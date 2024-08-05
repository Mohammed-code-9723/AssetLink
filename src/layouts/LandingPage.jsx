import React,{useState} from 'react'
import { Button } from '@mui/joy';
import { MdAutoAwesome } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";

import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
// import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Form } from 'rsuite';
import { useDispatch } from 'react-redux';
import { login } from '../features/UserSlice';
//
import '../styles/LandingPage.css';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [errorEmail,setErrorEmail]=useState({error:false});
    const [errorPassword,setErrorPassword]=useState({error:false});

    const dispatch = useDispatch();
    const navigate=useNavigate();

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
            // setTimeout(() => {
                navigate('/dashboard/SuperAdmin');
            // }, 5000);
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
                                <Form.HelpText>
                                    <Form.HelpText>{errorEmail.error?(<span style={{color:'red'}}><strong>Error!</strong> Email is required</span>):<span>Required</span>}</Form.HelpText>
                                </Form.HelpText>
                                </Form.Group>
                                <Form.Group controlId="password-1">
                                <Form.ControlLabel>Password</Form.ControlLabel>
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
