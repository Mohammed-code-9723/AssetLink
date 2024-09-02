import React,{useState,useEffect} from 'react'
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
import { useTranslation } from 'react-i18next';
import LoaderComponent from './LoaderComponent';

//!ant design:
import { Carousel } from 'antd';

export default function LandingPage() {

    const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [errorEmail,setErrorEmail]=useState({error:false});
    const [errorPassword,setErrorPassword]=useState({error:false});


    const [LoaderState,setLoaderState]=useState(false);

    const {t } = useTranslation();

    
    const dispatch = useDispatch();
    const navigate=useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('token')){
            localStorage.removeItem('token');
        }
    },[])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpen(false);
        setLoaderState(true);

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
            navigate('/dashboard/home/dashboard');
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

    useEffect(()=>{
        const intervalLoader=setTimeout(() => {
            setLoaderState(false);
        }, 3000);
        return ()=>clearTimeout(intervalLoader);
    },[LoaderState]);
    
    return (
        <>
            <div className='landing_container'>
                {
                    t('welcome1')==="إدارة العقارات"?(
                        <React.Fragment>
                            <div className='image_section' style={{marginLeft:'-20px',paddingRight:'0px'}}>
                                <Carousel autoplay  autoplaySpeed={3000} speed={500}  easing='ease-in-out'>
                                    <div >
                                        <img src="/realEstate.png" alt="realEstate" id='imgHouse'/>
                                    </div>
                                    <div >
                                        <img src="/assets/asset_2.png" alt="realEstate" id='imgHouse2'/>
                                    </div>
                                    <div >
                                        <img src="/assets/isometric.png" alt="realEstate" id='imgHouse2'/>
                                    </div>
                                </Carousel>
                            </div>
                            <div className='hero_section'  style={{marginLeft:'-80px',padding:'0 80px'}}>
                                {t('welcome1')} &nbsp;
                                {t('welcome2')} &nbsp;
                                {t('welcome3')}  &nbsp;
                                <MdAutoAwesome size={50}/><br />
                                <Button 
                                onClick={handleOpen}
                                sx={{
                                    width:'50%',
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
                            </div>
                        </React.Fragment>
                    ):(
                        <React.Fragment>
                            <div className='hero_section' style={{marginLeft:'-20px'}}>
                                {t('welcome1')} <br />
                                {t('welcome2')} <br />
                                {t('welcome3')}  
                                <MdAutoAwesome size={50}/><br />
                                <Button 
                                onClick={handleOpen}
                                sx={{
                                    width:'50%',
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
                            </div>
                            
                            <div className='image_section' style={{marginLeft:'-90px',paddingRight:'40px'}}>
                                <Carousel autoplay  autoplaySpeed={3000} speed={500}  easing='ease-in-out'>
                                    <div >
                                        <img src="/realEstate.png" alt="realEstate" id='imgHouse'/>
                                    </div>
                                    <div >
                                        <img src="/assets/asset_2.png" alt="realEstate" id='imgHouse2'/>
                                    </div>
                                    <div >
                                        <img src="/assets/isometric.png" alt="realEstate" id='imgHouse2'/>
                                    </div>
                                </Carousel>
                            </div>
                        </React.Fragment>
                    )
                }
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
                                height:'100%',
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

                {/* Loader modal */}
                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={LoaderState}
                    onClose={() => setLoaderState(false)}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',zIndex:1000000 }}
                >
                    <LoaderComponent/>
                </Modal>
            </div>
            
        </>
    )
}
