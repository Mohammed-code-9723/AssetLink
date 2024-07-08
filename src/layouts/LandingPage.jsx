import React from 'react'
import { Button } from '@mui/joy';
import { MdAutoAwesome } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";

export default function LandingPage() {
    return (
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
                sx={{
                    width:'50%',
                    borderRadius: '20px',
                    background:'#088fa6' 
                }}>
                    <FiLogIn />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Log in
                </Button>
            </div>
            <div style={{width:'70%'}}>
                <img src="/realEstate.png" alt="realEstate" />
            </div>
        </div>
    )
}
