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
import { Timeline, Loader } from 'rsuite';

import { LineChart, Line,RadialBarChart, RadialBar} from 'recharts';


import refreshToken from '../features/SuperAdminSlice';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
    
    const {t}=useTranslation();
    
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


    const dataRadial = [
        {
          name: '18-24',
          uv: 31.47,
          pv: 2400,
          fill: '#8884d8',
        },
        {
          name: '25-29',
          uv: 26.69,
          pv: 4567,
          fill: '#83a6ed',
        },
        {
          name: '30-34',
          uv: 15.69,
          pv: 1398,
          fill: '#8dd1e1',
        },
        {
          name: '35-39',
          uv: 8.22,
          pv: 9800,
          fill: '#82ca9d',
        },
        {
          name: '40-49',
          uv: 8.63,
          pv: 3908,
          fill: '#a4de6c',
        },
        {
          name: '50+',
          uv: 2.63,
          pv: 4800,
          fill: '#d0ed57',
        },
        {
          name: 'unknow',
          uv: 6.67,
          pv: 4800,
          fill: '#ffc658',
        },
      ];
      
      const style = {
        top: '50%',
        right: 0,
        transform: 'translate(0, -50%)',
        lineHeight: '24px',
      };
    

    const data = [ 
        {
            name: 'Admins',
            nbr: users?.users.filter((user)=>user.role==="admin").length,
        },
        {
            name: 'Managers',
            nbr: users?.users.filter((user)=>user.role==="manager").length,
        },
        {
            name: 'Engineers',
            nbr: users?.users.filter((user)=>user.role==="ingenieur").length,
        },
        {
            name: 'Technicians',
            nbr: users?.users.filter((user)=>user.role==="technicien").length,
        },
        {
            name: 'Regular users',
            nbr: 12
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

    const dataLine = [
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
    
    return (
        <div>
            <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
                {[t('dashboard'),''].map((item) => (
                <Link key={item} color="neutral" href="#sizes">
                    <h5>
                        {item} 
                    </h5>
                </Link>
                ))}
            </Breadcrumbs>
            <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',width:'100%'}}>
                
                    <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%' }}>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <Sheet variant="outlined" color="neutral" sx={{ marginTop:'20px',p: 1,borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                                <Item className='itemsDash' style={{height:'70px',boxShadow:'0px 0 2px rgb(1, 138, 143)',
                                    display:'flex',alignItems:'center',justifyContent:'center'
                                }}>
                                    <h4>{t('welcome')===("Welcome"||"Bienvenue")?t('welcome'):''} {user.name} {t('welcome')==="مرحبا"?t('welcome'):''}</h4>
                                </Item>
                            </Sheet>
                        </Grid>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <Sheet variant="outlined" color="neutral" sx={{ marginTop:'20px',p: 1,borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                                <Item  style={{height:'70px',boxShadow:'0px 0 2px rgb(1, 138, 143)',
                                    display:'flex',alignItems:'center',justifyContent:'center',
                                    backgroundImage:'url("/assets/isometric-house.jpg")',
                                    backgroundSize:'cover',
                                    backgroundRepeat:'no-repeat',
                                    backgroundPosition:'center',
                                    // objectFit:'fill'
                                }}>
                                    {/* <img src="/assets/isometric-house.jpg" alt="" className='imgHH'/> */}
                                </Item>
                            </Sheet>
                        </Grid>
                    </Grid>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',width:'100%',marginTop:'20px'}}>
                <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%' }}>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Sheet variant="outlined" color="neutral" sx={{ p: 1,borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                            <Item className='itemsDash' style={{height:'70px',boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                                <Avatar style={{background:'black',position:'absolute',top:'-15px',left:'10px'}}>
                                    <FaUsers />
                                </Avatar>
                                <h6 style={{marginTop:'10px'}}>{t("users.totalUsers")}</h6>
                                <h5 style={{marginTop:'8px'}}>
                                    {users && users.users.length > 0 ? (
                                        <span>{users.users.length}</span>
                                    ) : (
                                        <Loader content="Loading..." />
                                    )
                                    }
                                </h5>
                            </Item>
                        </Sheet>
                    </Grid>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Sheet variant="outlined" color="neutral" sx={{ p: 1,borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                            <Item className='itemsDash' style={{height:'70px',boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                                <Avatar style={{background:'rgb(5, 77, 172)',position:'absolute',top:'-15px',left:'10px'}}>
                                    <FaProjectDiagram />
                                </Avatar>
                                <h6 style={{marginTop:'10px'}}>{t("users.totalWorkspaces")}</h6>
                                <h5 style={{marginTop:'8px'}}>
                                    {workspaces && workspaces.length > 0 ? (
                                        <span>{workspaces.length}</span>
                                    ) : (
                                        <Loader content="Loading..." />
                                    )
                                    }
                                </h5>
                            </Item>
                        </Sheet>
                    </Grid>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Sheet variant="outlined" color="neutral" sx={{ p: 1,borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                            <Item className='itemsDash' style={{height:'70px',boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                                <Avatar style={{background:'rgba(7,28,75,1)',position:'absolute',top:'-15px',left:'10px'}}>
                                    < SiTestcafe/>
                                </Avatar>
                                <h6 style={{marginTop:'10px'}}>{t("users.totalSites")}</h6>
                                <h5 style={{marginTop:'8px'}}>
                                    {sites && sites.length > 0 ? (
                                        <span>{sites.length}</span>
                                    ) : (
                                        <Loader content="Loading..." />
                                    )
                                    }
                                </h5>
                            </Item>
                        </Sheet>
                    </Grid>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Sheet variant="outlined" color="neutral" sx={{ p: 1,borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                            <Item className='itemsDash' style={{height:'70px',boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                                <Avatar style={{background:'rgb(5, 172, 150)',position:'absolute',top:'-15px',left:'10px'}}>
                                    < FaBuilding/>
                                </Avatar>
                                <h6 style={{marginTop:'10px'}}>{t("users.totalBuildings")}</h6>
                                <h5 style={{marginTop:'8px'}}>
                                    {buildings && buildings.buildings.length > 0 ? (
                                        <span>{buildings.buildings.length}</span>
                                    ) : (
                                        <Loader content="Loading..." />
                                    )
                                    }
                                </h5>
                            </Item>
                        </Sheet>
                    </Grid>
                </Grid>
            </div>
            <div>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid sm={12} md={12} xs={12} lg={6}>
                        {/* <Item> */}
                            <ResponsiveContainer width="100%" height="100%">
                                <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{ marginTop:'20px',p: 1,borderRadius:'5px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                                <Item className='dash_items'>
                                    <center>
                                        <h4>Users by category</h4>
                                    </center>
                                <BarChart
                                
                                width={520}
                                height={300}
                                data={data}
                                
                                >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="nbr"  fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                                {/* <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
                                </BarChart>
                                </Item>
                        </Sheet>
                            </ResponsiveContainer>
                        {/* </Item> */}
                    </Grid>
                    <Grid sm={12} md={12} xs={12} lg={6}>
                        <ResponsiveContainer width="100%" height="100%">
                        <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{ marginTop:'20px',p: 1,borderRadius:'5px' ,boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                            <Item className='dash_items'>
                                <center>
                                    <h4>Risque's</h4>
                                </center>
                                <PieChart width={530} height={300}>
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
                            </Item>
                            </Sheet>
                        </ResponsiveContainer>
                    </Grid>
                    <Grid sm={12} md={12} xs={12} lg={12}>
                        <ResponsiveContainer width="100%" height="100%">
                        <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{ p: 1,borderRadius:'5px' ,boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                            <Item className='dash_items'>
                                <center>
                                    <h4>Others 1</h4>
                                </center>
                                <LineChart
                                    width={1120}
                                    height={300}
                                    data={dataLine}
                                    margin={{
                                        top: 5,
                                        // right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                    >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Legend />
                                    <Line yAxisId="left" type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    <Line yAxisId="right" type="monotone" dataKey="uv" stroke="#82ca9d" />
                                </LineChart>
                            </Item>
                            </Sheet>
                        </ResponsiveContainer>
                    </Grid>
                    <Grid sm={12} md={12} xs={12} lg={6}>
                        <ResponsiveContainer width="100%" height="100%">
                        <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{ p: 1,borderRadius:'5px' ,boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                            <Item className='dash_items'>
                                <center>
                                    <h4>Radial chart</h4>
                                </center>
                                <RadialBarChart width={530} height={300} cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={dataRadial}>
                                    <RadialBar
                                    
                                        minAngle={15}
                                        label={{ position: 'insideStart', fill: '#fff' }}
                                        background
                                        clockWise
                                        dataKey="uv"
                                    />
                                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
                                    <Tooltip/>
                                </RadialBarChart>
                            </Item>
                            </Sheet>
                        </ResponsiveContainer>
                    </Grid>
                    <Grid xs={12} lg={6}>
                        <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{p: 1,borderRadius:'5px' ,boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                            <Item className='dash_items'>
                                <center>
                                    <h4>Activities</h4>
                                </center>
                                <Timeline endless style={{marginTop:'20px'}}>
                                    {
                                        activities&&activities.map((activity,index)=>(
                                            <Timeline.Item> <strong>{activity.created_at}</strong> - <strong>{users&&users.users.find((user)=>user.id===activity.user_id).name}</strong> - {activity.action} - {activity.description}</Timeline.Item>
                                        ))
                                    }
                                </Timeline>
                            </Item>
                        </Sheet>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
