import React, { useEffect } from 'react'
import '../styles/SuperAdminDahsboard.css';
import { Navigate } from 'react-router-dom';

import { styled } from '@mui/joy/styles';
import Grid from '@mui/joy/Grid';
import { FaProjectDiagram } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import Sheet from '@mui/joy/Sheet';
import Link from '@mui/joy/Link';
import { AvatarGroup, Badge, Avatar, Divider } from 'rsuite';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import { FaUsers } from "react-icons/fa6";
import { SiTestcafe } from "react-icons/si";
import { BarChart, Bar,PieChart,Pie, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { fetchUsersData } from '../features/UserSlice';
import { workspacesData,sitesData ,buildingsData,activitiesData} from '../features/SuperAdminSlice';

import { useDispatch,useSelector } from 'react-redux';
import { Timeline } from 'rsuite';


import refreshToken from '../features/SuperAdminSlice';

import { useNavigate } from 'react-router-dom';

const Item = styled(Sheet)(({ theme }) => ({
    backgroundColor:theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
    ...theme.typography['body-sm'],
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 4,
    color: theme.vars.palette.text.secondary,
}));

export default function SuperAdminHome() {

    const navigate=useNavigate();
    const user=JSON.parse(localStorage.getItem('user'));
    const token=localStorage.getItem('token');

    //! all users fetching:
    const dispatch = useDispatch();
    const { users, status, error } = useSelector((state) => state.users);
    const { workspaces, statusWorkspaces , errorWorkspaces } = useSelector((state) => state.workspaces);
    const { sites, statusSites , errorSites } = useSelector((state) => state.sites);
    const { buildings, statusBuildings , errorBuildings } = useSelector((state) => state.buildings);
    const { activities, statusActivities , errorActivities } = useSelector((state) => state.activities);
    
    useEffect(()=>{

        dispatch(activitiesData(token));
        dispatch(workspacesData(token));
        dispatch(sitesData(token));
        dispatch(buildingsData(token));

    },[dispatch]);
    console.log(activities, statusActivities , errorActivities );
    useEffect(() => {
        const checkAndFetchUsers = async () => {
            let currentToken = token;
            if (currentToken && isTokenExpired(currentToken)) {
                currentToken = await refreshToken();
            }
            if (currentToken) {
                dispatch(fetchUsersData(currentToken));
            } else {
                localStorage.removeItem('token');
                alert('Session expired. Please log in again.');
                navigate('/');
            }
        };

        checkAndFetchUsers();
    }, [dispatch, token]);

    const isTokenExpired = (token) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    };


    

    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    const data01 = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
        { name: 'Group E', value: 278 },
        { name: 'Group F', value: 189 },
    ];
    
    const data02 = [
        { name: 'Group A', value: 2400 },
        { name: 'Group B', value: 4567 },
        { name: 'Group C', value: 1398 },
        { name: 'Group D', value: 9800 },
        { name: 'Group E', value: 3908 },
        { name: 'Group F', value: 4800 },
    ];

    
    
    return (
        <div>
            <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
                {['Dashboard',''].map((item) => (
                <Link key={item} color="neutral" href="#sizes">
                    <h5>
                        {item} 
                    </h5>
                </Link>
                ))}
            </Breadcrumbs>
            <div>
                <Sheet>
                    <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%' }}>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <Item className='itemsDash' style={{height:'70px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)',
                                display:'flex',alignItems:'center',justifyContent:'center'
                            }}>
                                <h4>Welcome {user.name}</h4>
                            </Item>
                        </Grid>
                    </Grid>
                </Sheet>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',width:'100%',marginTop:'20px'}}>
                <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%' }}>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Item className='itemsDash' style={{height:'70px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)'}}>
                            <Avatar style={{background:'black',position:'absolute',top:'-15px',left:'10px'}}>
                                <FaUsers />
                            </Avatar>
                            <h5>Total Users</h5>
                            <h5>
                                {users && users.users.length > 0 ? (
                                    <span>{users.users.length}</span>
                                ) : (
                                    <span>No users found</span>
                                )
                                }
                            </h5>
                        </Item>
                    </Grid>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Item className='itemsDash' style={{height:'70px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)'}}>
                            <Avatar style={{background:'rgb(5, 77, 172)',position:'absolute',top:'-15px',left:'10px'}}>
                                <FaProjectDiagram />
                            </Avatar>
                            <h5>Total Workspaces</h5>
                            <h5>
                                {workspaces && workspaces.length > 0 ? (
                                    <span>{workspaces.length}</span>
                                ) : (
                                    <span>No workspaces found</span>
                                )
                                }
                            </h5>
                        </Item>
                    </Grid>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Item className='itemsDash' style={{height:'70px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)'}}>
                            <Avatar style={{background:'rgba(7,28,75,1)',position:'absolute',top:'-15px',left:'10px'}}>
                                < SiTestcafe/>
                            </Avatar>
                            <h5>Total Sites</h5>
                            <h5>
                                {sites && sites.length > 0 ? (
                                    <span>{sites.length}</span>
                                ) : (
                                    <span>No sites found</span>
                                )
                                }
                            </h5>
                        </Item>
                    </Grid>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Item className='itemsDash' style={{height:'70px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)'}}>
                            <Avatar style={{background:'rgb(5, 172, 150)',position:'absolute',top:'-15px',left:'10px'}}>
                                < FaBuilding/>
                            </Avatar>
                            <h5>Total Buildings</h5>
                            <h5>
                                {buildings && buildings.buildings.length > 0 ? (
                                    <span>{buildings.buildings.length}</span>
                                ) : (
                                    <span>No sites found</span>
                                )
                                }
                            </h5>
                        </Item>
                    </Grid>
                </Grid>
            </div>
            <div>
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                        <Grid xs={6} sx={{
                            height:'300px'
                        }}>
                            {/* <Item> */}
                                <ResponsiveContainer width="100%" height="100%">
                                    <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{ marginTop:'20px',p: 4,borderRadius:'10px' }}>
                                    <Item className='dash_items'><h4>Make this a choice option</h4></Item>
                                    <BarChart
                                    width={500}
                                    height={300}
                                    data={data}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                    >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                                    <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                                    </BarChart>
                            </Sheet>
                                </ResponsiveContainer>
                            {/* </Item> */}
                        </Grid>
                        <Grid xs={6}>
                            <ResponsiveContainer width="100%" height="100%">
                            <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{ marginTop:'20px',p: 4,borderRadius:'10px' }}>
                                <Item className='dash_items'><h4>Risque's</h4></Item>
                                <PieChart width={500} height={300}>
                                <Pie
                                    dataKey="value"
                                    isAnimationActive={false}
                                    data={data01}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                />
                                <Tooltip />
                                </PieChart>
                                </Sheet>
                            </ResponsiveContainer>
                        </Grid>
                        <Grid xs={6}>
                            <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{p: 4,borderRadius:'10px' }}>
                                <Item className='dash_items'><h4>Others</h4></Item>
                            </Sheet>
                        </Grid>
                        <Grid xs={6}>
                            <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{p: 4,borderRadius:'10px' }}>
                                <Item className='dash_items'><h4>Activities</h4></Item>
                                <Timeline endless style={{marginTop:'20px'}}>
                                    {
                                        activities&&activities.map((activity,index)=>(
                                            <Timeline.Item> <strong>{activity.created_at}</strong> - <strong>{users&&users.users.find((user)=>user.id===activity.user_id).name}</strong> - {activity.action} - {activity.description}</Timeline.Item>
                                        ))
                                    }
                                </Timeline>
                            </Sheet>
                        </Grid>
                    </Grid>
            </div>
        </div>
    )
}