import React,{ useState , useEffect} from 'react';

//! CSS:
import '../styles/Sidebar.css';
import 'rsuite/dist/rsuite.min.css';
import { FaCity } from "react-icons/fa";
import { Divider } from '@mui/joy';
import { Sidenav, Nav } from 'rsuite';
import { FaVectorSquare } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
//
import { RiProjectorFill } from "react-icons/ri";
import { Cascader } from 'rsuite';
import { FaBuilding, FaCog, FaLeaf, FaHistory, FaPlus, FaExpandArrowsAlt } from 'react-icons/fa';
import { Dropdown } from 'rsuite';

//
import { FiBarChart2 } from "react-icons/fi";
import { GiNetworkBars } from "react-icons/gi";
import { IoInfinite } from "react-icons/io5";
import { MdInventory } from "react-icons/md";
import { NavLink, useLocation,Navigate } from 'react-router-dom';
//
import { RiUserAddFill } from "react-icons/ri";
import { FaUserCog } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaUsers as Us } from "react-icons/fa6";
import { MdWorkspacesFilled } from "react-icons/md";
import { FaUserShield } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { useTranslation } from 'react-i18next';
import { PopoverPaper } from '@mui/material';

export default function Sidebar({onToggle}) {
    const [expanded, setExpanded] = React.useState(true);
    const [activeKey, setActiveKey] = React.useState('1');

    const user=JSON.parse(localStorage.getItem('user'));
    const token=localStorage.getItem('token');
    const location=useLocation();
    const {t } = useTranslation();


    if (!token) {
        return <Navigate to="/"/>
    }

    const handleToggle = () => {
        setExpanded(!expanded);
        onToggle();
    };
    
    return (
        <div style={{ minWidth:expanded?260:'',paddingTop:'55px' ,height:'100%',boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>

            <Sidenav className='Sidenav' expanded={expanded} defaultOpenKeys={['3', '4']}>
                <Sidenav.Body className='sidenav_body' style={{overflowY:expanded?'scroll':'hidden'}}>
                    <div className='logoVille'>
                        <span><FaCity size={25}/></span>
                        <span style={{display:expanded?'inline':'none',fontWeight:'bold'}}>Ville de Meknès</span>
                    </div>
                    <center>
                        <Divider sx={{width:'80%'}}/>
                    </center>
                    <Nav activeKey={activeKey} style={{display:'flex',gap:55,flexDirection:'column',overflowX:'hidden'}} onSelect={setActiveKey}>
                        <NavLink to={user.role==="superadmin"?'/dashboard/SuperAdmin':'/dashboard'} eventKey="1" className='dash_links' style={{width:'100%',display:'flex',alignItems:'center',height:'50px'}}>
                            <span style={{width:!expanded?'100%':'28%',display:'flex',alignItems:'center',justifyContent:'center'}}><MdDashboard  size={18}/></span>
                            <span style={{ width: '90%' ,display:expanded?'inline':'none'}} >{t('dashboard')}</span>
                        </NavLink>
                        <div eventKey="2" style={{width:'100%',display:user.role==="superadmin"?'none':'flex'}}>
                            <span style={{width:!expanded?'100%':'28%',display:'flex',alignItems:'center',justifyContent:'center'}}><FaVectorSquare size={18}/></span>
                            <Cascader
                                // data={data}
                                style={{ width: '90%' ,marginRight:'3px',display:expanded?'inline':'none'}} 
                                placeholder="All Workspaces" 
                            />
                        </div>
                        <div eventKey="2" style={{width:'100%',display:user.role==="superadmin"?'none':'flex'}}>
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
                                {
                                    user.role==="superadmin"?(
                                        <Dropdown title={t("users.users")}  icon={<Us style={{position:'absolute',left:expanded?'21px':'18px'}}/>} placement="rightStart">
                                    <Dropdown.Item eventKey="4" className='Dropdown_items'>
                                        <NavLink to='/dashboard/SuperAdmin/AllUsers' className='main_links'>
                                            <FaUsers  style={{marginRight:'10px'}}/>
                                            <span>
                                                {t("users.allUsers")}
                                            </span>
                                        </NavLink>
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="1" className='Dropdown_items'>
                                        <NavLink to='/dashboard/SuperAdmin/Permissions' className='main_links'>
                                            <FaUserShield   style={{marginRight:'10px'}}/>
                                                <span>
                                                    {t("users.permissions")}
                                                </span>
                                        </NavLink>
                                    </Dropdown.Item>
                                    {/* {
                                        !expanded&&(
                                            
                                        )
                                    } */}
                                </Dropdown>
                                    ):(
                                <Dropdown title="Main Inventory" icon={<MdInventory style={{position:'absolute',left:expanded?'21px':'18px'}}/>} placement="rightStart">
                                    <Dropdown.Item eventKey="1" className='Dropdown_items'>
                                        <NavLink to='/dashboard/Site' className='main_links'>
                                            <FaExpandArrowsAlt  style={{marginRight:'10px'}}/>
                                            <span>
                                                Site
                                            </span>
                                        </NavLink>
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="2" className='Dropdown_items'>
                                        <NavLink to='/dashboard/Building' className='main_links'>
                                            <FaBuilding  style={{marginRight:'10px'}}/>
                                            <span>
                                                Building
                                            </span>
                                        </NavLink>
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="3" className='Dropdown_items'>
                                        <NavLink to='/dashboard/Component' className='main_links'>
                                            <FaCog  style={{marginRight:'10px'}}/>
                                            <span>
                                                Component
                                            </span>
                                        </NavLink>
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="4" className='Dropdown_items'>
                                        <NavLink to='/dashboard/Energy' className='main_links'>
                                            <FaLeaf  style={{marginRight:'10px'}}/>
                                            <span>
                                                Energy performance
                                            </span>
                                        </NavLink>
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="5" className='Dropdown_items'>
                                        <NavLink to='/dashboard/Energy' className='main_links'>
                                            <FaHistory  style={{marginRight:'10px'}}/>
                                            <span>
                                                Imports history
                                            </span>
                                        </NavLink>
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="6" className='Dropdown_items'>
                                        <NavLink to='/dashboard/Energy' className='main_links'>
                                            <FaPlus style={{marginRight:'10px'}} />
                                            <span>
                                                Import
                                            </span>
                                        </NavLink>
                                    </Dropdown.Item>
                                </Dropdown>
                                    )
                                }
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
                                {
                                    user.role==="superadmin"?(
                                        <Dropdown title={t("users.workspaces")} icon={<MdWorkspacesFilled size={20} style={{position:'absolute',left:expanded?'21px':'18px'}}/>} placement="rightStart">
                                            <Dropdown.Item eventKey="5"  className='Dropdown_item_workspace'>
                                                <NavLink to='/dashboard/SuperAdmin/Workspaces' className='workspace_links'>
                                                    <MdWorkspacesFilled  style={{marginRight:'10px'}}/>
                                                    <span>
                                                        {t("users.allWorkspaces")}
                                                    </span>
                                                </NavLink>
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="7"  className='Dropdown_item_workspace'>
                                                <NavLink to='/dashboard/SuperAdmin/Sites' className='workspace_links'>
                                                    <MdWorkspacesFilled  style={{marginRight:'10px'}}/>
                                                    <span>
                                                        {t("users.allSites")}
                                                    </span>
                                                </NavLink>
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="8"  className='Dropdown_item_workspace'>
                                                <NavLink to='/dashboard/SuperAdmin/Buildings' className='workspace_links'>
                                                    <MdWorkspacesFilled  style={{marginRight:'10px'}}/>
                                                    <span>
                                                        {t("users.allBuildings")}
                                                    </span>
                                                </NavLink>
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="8"  className='Dropdown_item_workspace'>
                                                <NavLink to='/dashboard/SuperAdmin/Components' className='workspace_links'>
                                                    <MdWorkspacesFilled  style={{marginRight:'10px'}}/>
                                                    <span>
                                                        {t("users.allComponents")}
                                                    </span>
                                                </NavLink>
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="8"  className='Dropdown_item_workspace'>
                                                <NavLink to='/dashboard/SuperAdmin/Incidents' className='workspace_links'>
                                                    <MdWorkspacesFilled  style={{marginRight:'10px'}}/>
                                                    <span>
                                                        {t("users.allIncidents")}
                                                    </span>
                                                </NavLink>
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="8"  className='Dropdown_item_workspace'>
                                                <NavLink to='/dashboard/SuperAdmin/Reports' className='workspace_links'>
                                                    <MdWorkspacesFilled  style={{marginRight:'10px'}}/>
                                                    <span> 
                                                        {t("users.allReports")}
                                                    </span>
                                                </NavLink>
                                            </Dropdown.Item>
                                        </Dropdown>
                                    ):(
                                        <Dropdown title="Scenarios" icon={<IoInfinite size={20} style={{position:'absolute',left:expanded?'21px':'18px'}}/>} placement="rightStart">
                                            <Dropdown.Item eventKey="1" icon={<IoInfinite  style={{marginRight:'10px'}}/>}>
                                                <NavLink to='/dashboard/Site' className='main_links'>
                                                    {t("users.allScenarios")}
                                                </NavLink>
                                            </Dropdown.Item>
                                        </Dropdown>
                                    )
                                }
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
                                <Dropdown title={t("users.analytics")} icon={<FiBarChart2 size={20} style={{position:'absolute',left:expanded?'21px':'18px'}}/>} placement="rightStart">
                                    <Dropdown.Item eventKey="1" icon={<GiNetworkBars  style={{marginRight:'10px'}}/>}>
                                        <NavLink to='/dashboard/Site' className='main_links'>
                                            {t("users.analytics")}
                                        </NavLink>
                                    </Dropdown.Item>
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
                                <Dropdown title={t("users.settings")} icon={<IoSettings size={20} style={{position:'absolute',left:expanded?'21px':'18px'}}/>} placement="rightStart">
                                    <Dropdown.Item eventKey="1" icon={<IoSettings  style={{marginRight:'10px'}}/>}>
                                        <NavLink to='/dashboard/SuperAdmin/Settings' className='main_links'>
                                            {t("users.settings")}
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
