import React,{ useState , useEffect} from 'react';

//! CSS:
import '../styles/Sidebar.css';
import 'rsuite/dist/rsuite.min.css';
import { FaCity } from "react-icons/fa";
import { Divider } from '@mui/joy';

import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import { FaVectorSquare } from "react-icons/fa6";
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import { MdDashboard } from "react-icons/md";
//
import { RiProjectorFill } from "react-icons/ri";
import { Cascader , InputGroup, Input} from 'rsuite';
import { FaBuilding, FaCog, FaLeaf, FaHistory, FaPlus, FaExpandArrowsAlt } from 'react-icons/fa';
import { Dropdown } from 'rsuite';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';

//

import { MdInventory } from "react-icons/md";
import { RiHistoryLine } from "react-icons/ri";
import { NavLink } from 'react-router-dom';
//

export default function Sidebar({onToggle}) {
    const [expanded, setExpanded] = React.useState(true);
    const [activeKey, setActiveKey] = React.useState('1');
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

    const handleToggle = () => {
        setExpanded(!expanded);
        onToggle();
    };
    return (
        <div style={{ minWidth:expanded?260:'',marginTop:'55px' }}>

            <Sidenav expanded={expanded} defaultOpenKeys={['3', '4']}>
                <Sidenav.Body >
                    <div className='logoVille'>
                        <span><FaCity size={25}/></span>
                        <span style={{display:expanded?'inline':'none',fontWeight:'bold'}}>Ville de Meknès</span>
                    </div>
                    <center>
                        <Divider sx={{width:'80%'}}/>
                    </center>
                    <Nav activeKey={activeKey} style={{display:'flex',gap:70,flexDirection:'column',height:'79vh',overflowY:expanded?'scroll':'hidden',overflowX:'hidden'}} onSelect={setActiveKey}>
                        <NavLink to='/dashboard' eventKey="1" style={{width:'100%',display:'flex',alignItems:'center',paddingTop:'30px'}}>
                            <span style={{width:!expanded?'100%':'28%',display:'flex',alignItems:'center',justifyContent:'center'}}><MdDashboard  size={18}/></span>
                            <span style={{ width: '90%' ,display:expanded?'inline':'none'}} >Dashboard</span>
                        </NavLink>
                        <div eventKey="2" style={{width:'100%',display:'flex'}}>
                            <span style={{width:!expanded?'100%':'28%',display:'flex',alignItems:'center',justifyContent:'center'}}><FaVectorSquare size={18}/></span>
                            <Cascader
                                // data={data}
                                style={{ width: '90%' ,marginRight:'3px',display:expanded?'inline':'none'}} 
                                placeholder="Périmètre" 
                            />
                        </div>
                        <div eventKey="2" style={{width:'100%',display:'flex'}}>
                            <span style={{width:!expanded?'100%':'28%',display:'flex',alignItems:'center',justifyContent:'center'}}><RiProjectorFill size={18}/></span>
                            <Cascader
                                // data={data}
                                style={{ width: '90%',borderTopLeftRadius:'0',marginRight:'3px',display:expanded?'inline':'none'}} 
                                placeholder="Projects" 
                            />
                        </div>
                        <div style={{width:'100%',display:'flex'}}>
                            <Nav style={{
                                width:'100%',
                                color:'rgb(71, 71, 71)',
                                display:'flex',
                                alignItems:'center',
                            }} 
                            
                            >
                                <Dropdown title="Main Inventory" icon={<MdInventory style={{position:'absolute',left:expanded?'21px':'13px'}}/>} placement="rightStart">
                                    <Dropdown.Item eventKey="1" icon={<FaExpandArrowsAlt  style={{marginRight:'10px'}}/>}>
                                        <NavLink to='/dashboard/Site' className='main_links'>
                                            Site
                                        </NavLink>
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="2" icon={<FaBuilding  style={{marginRight:'10px'}}/>}>
                                        <NavLink to='/dashboard/Building' className='main_links'>
                                            Building
                                        </NavLink>
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="3" icon={<FaCog  style={{marginRight:'10px'}}/>}>
                                        <NavLink to='/dashboard/Component' className='main_links'>
                                            Component
                                        </NavLink>
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="4" icon={<FaLeaf  style={{marginRight:'10px'}}/>}>
                                        <NavLink to='/dashboard/Energy' className='main_links'>
                                            Energy performance
                                        </NavLink>
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="5" icon={<FaHistory  style={{marginRight:'10px'}}/>}>Imports history</Dropdown.Item>
                                    <Dropdown.Item eventKey="6" icon={<FaPlus style={{marginRight:'10px'}} />}>Import</Dropdown.Item>
                                </Dropdown>
                            </Nav>
                        </div>
                        <div style={{width:'100%',display:'flex'}}>
                            <Nav style={{
                                width:'100%',
                                color:'rgb(71, 71, 71)',
                                display:'flex',
                                alignItems:'center'
                            }} 
                            
                            >
                                <Dropdown title="Scenarios" icon={<FaCog style={{position:'absolute',left:expanded?'21px':'13px'}}/>} placement="rightStart">
                                    <Dropdown.Item eventKey="1" icon={<FaExpandArrowsAlt  style={{marginRight:'10px'}}/>}>
                                        <NavLink to='/dashboard/Site' className='main_links'>
                                            Site
                                        </NavLink>
                                    </Dropdown.Item>
                                </Dropdown>
                            </Nav>
                        </div>
                    </Nav>
                </Sidenav.Body>
                <Sidenav.Toggle onToggle={handleToggle} />
            </Sidenav>
        </div>
    );
}
