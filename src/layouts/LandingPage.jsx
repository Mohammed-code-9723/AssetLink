import React from 'react'
import { Button } from '@mui/joy';
import { MdAutoAwesome } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";

import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Form } from 'rsuite';

export default function LandingPage() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    
    return (
        <>
            <div style={{
                background:'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)',
                width:'110%',
                margin:'-20px',
                padding:'10px',
                minHeight:'90dvh',
                display:'flex',
                justifyContent:'space-around',
                alignItems:'center',
                }}>
                <div style={{
                    width:'40%',
                    color:'white',
                    // background:'red',
                    fontWeight:'900',
                    fontSize:'4rem',
                    textAlign:'center'
                    
                }}>
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
                <div style={{width:'60%'}}>
                    <img src="/realEstate.png" alt="realEstate" style={{
                        width:'100%',
                        position:'relative ',
                    }}/>
                </div>
            </div>
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
                        // p: 3,
                        boxShadow: 'lg',
                        display:'flex',
                        height:'70vh'
                        // justifyContent:'space'
                    }}
                    >
                        <ModalClose variant="plain" sx={{ m: 1 }} />
                        <div style={{width:'40%'}}>
                            <img src="/wallpaper_1.jpg" alt="logImg" style={{
                                width:'100%',
                                position:'relative ',
                                borderTopLeftRadius:'7px',
                                borderBottomLeftRadius:'7px',
                                height:'70vh'
                            }}/>
                        </div>
                        <div style={{
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
                                <Form.Control name="email" type="email" />
                                <Form.HelpText>Required</Form.HelpText>
                                </Form.Group>
                                <Form.Group controlId="password-1">
                                <Form.ControlLabel>Password</Form.ControlLabel>
                                <Form.Control name="password" type="password" autoComplete="off" />
                                <Form.HelpText>Required</Form.HelpText>
                                </Form.Group>
                            </Form>
                            <div style={{
                                width:'100%',
                                display:'flex',
                                justifyContent:'space-evenly',
                                marginTop:'100px'
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
        </>
    )
}
